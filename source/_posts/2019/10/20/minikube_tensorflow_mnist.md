---
title: MinikubeとTensorFlow 2.0でGPUを使ってCIFAR-10
thumbnail: /gallery/daily/others/loss.png
categories:
  - Tech
  - MachineLearning
tags:
  - MachineLearning
  - Minikube
  - TensorFlow
  - Jupyter
  - Keras
  - MLOps
date: 2019-10-20 07:28:45
---
LinuxでGPU環境を構築して暫く経ちました。今回いろいろ古くなった環境を再構築する機会があったので、Linuxにおける機械学習の環境構築とCIFAR-10でディープラーニングに至る道程について簡単に記録に残しておくことにしました。

<!-- more -->

## 目次
<!-- toc -->

## 対象読者

本記事は、LinuxでGPUを用いた機械学習の環境を構築してみたい方を対象にしています。また、MLOpsに興味があり、機械学習基盤の構築に興味がある方にもおすすめします。本記事では実際に機械学習の環境を構築してディープラーニングで画像分類をおこなうところまでの手順を説明します。その際以下の知識があったほうがより深く理解が出来ますが、本記事を読むのに必須ではありません。

- Kubernetes
- JupyterLab
- TensorFlow
- Keras
- CNN(Convolutional Neural Network)

## マシンの準備

まずは機械学習用のマシンを調達します。マシンはLinuxが動作してNVIDIAのグラフィックボードを認識できれば問題ないです。グラフィックボードはなるべく新しいものの方が計算速度が速いのでいいと思います[^1]。
自分は「NVIDIA GeForce GTX1080 Ti」を利用しています。

[^1]: ただし新しすぎるとドライバがなかったり、バグがあったりするのでリサーチは十分行ってください。

## OSのインストール

Ubuntu 18.04を利用します。以下からダウンロードしてインストールします。

- {% elink Ubuntu 18.04 LTS 日本語 Remix リリース | Ubuntu Japanese Team https://www.ubuntulinux.jp/News/ubuntu1804-ja-remix %}

## NVIDIAドライバのインストール

「ソフトウェアとアップデート」を起動して「追加のドライバー」タブから「プロプライエタリ、検証済み」のドライバを選択して「変更の適用」をします。適用後に再起動してください。

{% img /gallery/daily/others/software-update.png %}

`nvidia-smi`コマンドが利用できて以下のような感じになればOKです。


{% code lang:shell %}
$ nvidia-smi
Sun Oct 20 09:55:26 2019
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 430.26       Driver Version: 430.26       CUDA Version: 10.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 108...  Off  | 00000000:01:00.0  On |                  N/A |
| 25%   36C    P8    13W / 250W |    261MiB / 11175MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0      1670      G   /usr/lib/xorg/Xorg                            18MiB |
|    0      1704      G   /usr/bin/gnome-shell                          49MiB |
|    0      3918      G   /usr/lib/xorg/Xorg                            87MiB |
|    0      4031      G   /usr/bin/gnome-shell                         103MiB |
+-----------------------------------------------------------------------------+
{% endcode %}

## Docker Engine for Community のインストール

以下の手順どおりに実行します。

- {% elink Get Docker Engine - Community for Ubuntu | Docker Documentation https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce %}

以下はコマンドの抜粋です。

```bash
$ sudo apt-get remove docker docker-engine docker.io containerd runc
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

インストール後は「`docker version`」のコマンドで確認します。

```
$ sudo docker version
Client: Docker Engine - Community
 Version:           19.03.3
 API version:       1.40
 Go version:        go1.12.10
 Git commit:        a872fc2f86
 Built:             Tue Oct  8 00:59:59 2019
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          19.03.3
  API version:      1.40 (minimum version 1.12)
  Go version:       go1.12.10
  Git commit:       a872fc2f86
  Built:            Tue Oct  8 00:58:31 2019
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.2.10
  GitCommit:        b34a5c8af56e510852c35414db4c1f4fa6172339
 nvidia:
  Version:          1.0.0-rc8+dev
  GitCommit:        3e425f80a8c931f88e6d94a8c831b9d5aa481657
 docker-init:
  Version:          0.18.0
  GitCommit:        fec3683
```

## NVIDIA Container Toolkitのインストール

以下に従って行います。

- {% elink NVIDIA/nvidia-docker: Build and run Docker containers leveraging NVIDIA GPUs https://github.com/NVIDIA/nvidia-docker %}

```
$ distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
$ curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
$ curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

$ sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
```

デフォルトのコンテナランタイムを変更するため`/etc/docker/daemon.json`に以下を記載します。
```json
{
    "default-runtime": "nvidia",
    "runtimes": {
        "nvidia": {
            "path": "/usr/bin/nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
```

dockerを再起動します。

```bash
$ sudo systemctl restart docker
```

以下のコマンドでdockerからGPUが見えているか確認します。

```bash
$ docker run nvidia/cuda:10.0-base nvidia-smi
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 430.26       Driver Version: 430.26       CUDA Version: 10.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 108...  Off  | 00000000:01:00.0  On |                  N/A |
| 25%   37C    P8    13W / 250W |    262MiB / 11175MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
+-----------------------------------------------------------------------------+
```

## kubectlのインストール

以下の手順でインストールします。

- {% elink Install and Set Up kubectl - Kubernetes https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux %}

{% code lang:sh %}
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.16.0/bin/linux/amd64/kubectl
$ chmod +x ./kubectl
$ sudo mv ./kubectl /usr/local/bin/kubectl
{% endcode %}

## Minikubeのインストール

以下に従って行います。

- {% elink Minikubeのインストール - Kubernetes https://kubernetes.io/ja/docs/tasks/tools/install-minikube/ %}

```bash
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
$ sudo cp minikube /usr/local/bin && rm minikube
```

以下のコマンドでMinikubeを実行します。`--vm-driver none`がポイントでこれをつけるとホスト上のDockerでKubernetesが実行されます。

```
sudo -E minikube start --vm-driver none
```

## Dockerイメージの作成

まずは機械学習用のDockerfileを作成します。Dockerfileは以下のとおりです。

{% code lang:dockerfile Dockerfile %}

FROM nvidia/cuda:10.0-cudnn7-devel

WORKDIR /
ENV PYENV_ROOT /.pyenv
ENV PATH $PYENV_ROOT/shims:$PYENV_ROOT/bin:$PATH

RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    imagemagick \
    bzip2 \
    graphviz \
    vim \
    tree \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*

RUN git clone git://github.com/yyuu/pyenv.git .pyenv

RUN pyenv install anaconda3-2019.10
RUN pyenv global anaconda3-2019.10
RUN pyenv rehash

RUN pip install tensorflow-gpu==2.0.0 gym

RUN conda install -c conda-forge jupyterlab
RUN conda install -c anaconda pandas-datareader
RUN conda install -c anaconda py-xgboost
RUN conda install -c anaconda graphviz
RUN conda install -c anaconda h5py
RUN conda install -c conda-forge tqdm

RUN mkdir /jupyter
WORKDIR /jupyter

ENV HOME  /jupyter
ENV LD_LIBRARY_PATH $LD_LIBRARY_PATH:/usr/local/cuda/extras/CUPTI/lib64
ENV SHELL /bin/bash

EXPOSE 8888

ENTRYPOINT ["jupyter", "lab", "--ip=0.0.0.0", "--no-browser", "--allow-root", "--NotebookApp.token=''"]
{% endcode %}

ポイントは以下のとおりです。

- ベースイメージとして`nvidia/cuda:10.0-cudnn7-devel`を指定
  - TensorFlow 2.0が動作可能なCUDAとcuDNNを指定
- `pyenv`で{% elink Anaconda https://www.anaconda.com/ %}をインストール
  - Anacondaでデータサイエンスに必要なパッケージの全部入りをざっくり入れる
  - minicondaで細かく指定して入れる方法もある
- `conda`でJupyterLabをインストール
- `pip`で`tensorflow-gpu`(2.0.0)をインストール
  - まだAnacondaに最新パッケージがなかったので`pip`でインストール
- `LD_LIBRARY_PATH`にCUPTIのライブラリのパスを指定
  - TensorFlowで利用されるのでパスを通しておく
- `ENTRYPOINT`でJupyterLabが起動するように指定する

次に以下のコマンドでイメージのビルドを行います。

{% code lang:shell %}
docker build -t ml/all:v0.1 .
{% endcode %}

以下のコマンドでイメージが作成できているかどうか確認します。

{% code lang:shell %}
$ docker image ls ml/all
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ml/all              v0.1               e23280bc3856        18 hours ago        11.3GB
{% endcode %}

## デプロイメントの作成

以下のようなyamlファイルを作成し、上記で作成したイメージをMinikubeにデプロイします。

{% code lang:yaml ml-deploy.yaml %}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-deployment
  labels:
    app: ml-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ml-deploy
  template:
    metadata:
      annotations:
        kubernetes.io/change-cause: "modified at 2019-10-20 05:50:40 +0900"
      labels:
        app: ml-deploy
    spec:
      containers:
        - name: ml-deploy
          image: ml/all:v1.0
          ports:
            - containerPort: 8888
          volumeMounts:
            - name: notebook
              mountPath: /jupyter
          imagePullPolicy: IfNotPresent
      volumes:
        - name: notebook
          hostPath:
            path: /home/jupyter/ml-all
            type: Directory
{% endcode %}

以下のコマンドでデプロイメントの作成を行います。

```shell
kubectl apply -f ml-deploy.yml
```

以下のコマンドでデプロイメントが作成されていることを確認します。

```shell
$ kubectl get deployments
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
ml-deployment   1/1     1            1           36h
```

## サービスの作成

以下のようなyamlファイルを作成し、上記で作成したイメージをデプロイメントをサービスとして公開します。

{% code lang:yaml ml-svc.yaml %}
kind: Service
apiVersion: v1
metadata:
  name: ml-svc
spec:
  selector:
    app: ml-deploy
  ports:
    - protocol: TCP
      port: 8888
      targetPort: 8888
      nodePort: 30001
  type: NodePort
{% endcode %}

以下のコマンドでサービスの作成を行います。

```shell
$ kubectl apply -f ml-svc.yml
```

以下のコマンドでサービスが作成されていることを確認します。

```shell
$ kubectl get services
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          37h
ml-svc       NodePort    10.103.99.171   <none>        8888:30001/TCP   36h
```

サービスの作成はkubectlのexposeコマンドを用いても行うことができます。
ここまででようやく機械学習の環境が整いました。

## JupyterLabでノートブックを作成

ブラウザで以下のアドレスにアクセスします。

{% code %}
http://(minikubeが起動しているマシンのIPアドレス):30001/
{% endcode %}

`+`ボタンを押して、Lancherを起動し、Python3のノートブックを作成します。

{% img /gallery/daily/others/jupyterlab.png %}
　
最初は「Untitled.ipynb」というファイル名で作成されますが、ファイルを右クリックで「Rename」を選択してファイル名を変更できます。今回は「cifar10.ipynb」に変更します。

## TensorFlow 2.0 with Kerasで画像分類(CIFAR-10)

ようやくお待ちかねのディープラーニングのターンです。今回はようやく最近正式リリースされたTensorFlow 2.0に密に統合されたKerasのAPIを利用してCIFAR-10の画像セットを用いて画像分類を行います。

ソースコードは{% elink keras/cifar10_cnn.py  https://github.com/keras-team/keras/blob/master/examples/cifar10_cnn.py %}をベースにtensorflow対応や可視化表示のコードを加えたものになります。先程作成したノートブックに貼り付けて実行してください。適当にセルに分割して実行したほうが良いと思います。

{% code lang:python %}
import tensorflow as tf
import numpy as np
import os
# GPUをオフにする場合
# os.environ["CUDA_VISIBLE_DEVICES"]="-1"
from tensorflow import keras
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Activation, Flatten
from tensorflow.keras.layers import Conv2D, MaxPooling2D
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
%matplotlib inline

# GPUのメモリを必要な量だけ使うようにする
physical_devices = tf.config.experimental.list_physical_devices('GPU')[0]
tf.config.experimental.set_memory_growth(physical_devices, True)

# パラメータの宣言
batch_size = 32
num_classes = 10
epochs = 15
num_predictions = 20
save_dir = os.path.join(os.getcwd(), 'saved_models')
model_name = 'keras_cifar10_trained_model.h5'

# CIFAR-10のデータロード
(x_train, y_train), (x_test, y_test) = cifar10.load_data()
print('x_train shape:', x_train.shape)
print(x_train.shape[0], 'train samples')
print(x_test.shape[0], 'test samples')


# 画像の表示
LABELS = ('airplane', 'mobile', 'bird', 'cat', 'deer',
          'dog', 'frog', 'horse','ship', 'truck')

def to_label(v):
  idx = np.argmax(v)
  if idx < len(LABELS):
    return LABELS[idx]
  else:
    return None

plt.clf()
for i in range(0, 40):
  plt.subplot(5, 8, i+1)
  plt.tight_layout()
  pixels = x_train[i,:,:,:]
  plt.title(to_label(y_train[i]), fontsize=8)
  fig = plt.imshow(pixels)
  fig.axes.get_xaxis().set_visible(False)
  fig.axes.get_yaxis().set_visible(False)

# One-Hot Vectorに変換
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)

# モデルの構築
model = Sequential()
model.add(Conv2D(32, (3, 3), padding='same',
                 input_shape=x_train.shape[1:]))
model.add(Activation('relu'))
model.add(Conv2D(32, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Conv2D(64, (3, 3), padding='same'))
model.add(Activation('relu'))
model.add(Conv2D(64, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))

model.add(Flatten())
model.add(Dense(512))
model.add(Activation('relu'))
model.add(Dropout(0.5))
model.add(Dense(num_classes))
model.add(Activation('softmax'))

# モデルのコンパイル
model.compile(loss='categorical_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])
model.summary()

# データの正規化
x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255

# モデルの訓練
history = model.fit(x_train, y_train,
              batch_size=batch_size,
              epochs=epochs,
              validation_data=(x_test, y_test),
              shuffle=True)

# 訓練したモデルの保存
if not os.path.isdir(save_dir):
    os.makedirs(save_dir)
model_path = os.path.join(save_dir, model_name)
model.save(model_path)
print('Saved trained model at %s ' % model_path)

# モデルの評価
scores = model.evaluate(x_test, y_test, verbose=0)
print('Test loss:', scores[0])
print('Test accuracy:', scores[1])


# モデルの訓練仮定の可視化
loss     = history.history['loss']
val_loss = history.history['val_loss']

nb_epoch = len(loss)
plt.plot(range(nb_epoch), loss,     marker='.', label='loss')
plt.plot(range(nb_epoch), val_loss, marker='.', label='val_loss')
plt.legend(loc='best', fontsize=10)
plt.grid()
plt.xlabel('epoch')
plt.ylabel('loss')
plt.show()
{% endcode %}

## 実行結果

分類対象の画像です。CIFAR-10では32x32のサイズの画像を10種類に分類します。

{% img /gallery/daily/others/cifar10-image-train.png %}

モデルの要約です。畳み込み層、プーリング層、ドロップアウト層、活性化層(relu)を利用した典型的なCNNになっています。最後の出力には全結合層と活性化層(SoftMax)を利用しています。

```
Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
conv2d (Conv2D)              (None, 32, 32, 32)        896       
_________________________________________________________________
activation (Activation)      (None, 32, 32, 32)        0         
_________________________________________________________________
conv2d_1 (Conv2D)            (None, 30, 30, 32)        9248      
_________________________________________________________________
activation_1 (Activation)    (None, 30, 30, 32)        0         
_________________________________________________________________
max_pooling2d (MaxPooling2D) (None, 15, 15, 32)        0         
_________________________________________________________________
dropout (Dropout)            (None, 15, 15, 32)        0         
_________________________________________________________________
conv2d_2 (Conv2D)            (None, 15, 15, 64)        18496     
_________________________________________________________________
activation_2 (Activation)    (None, 15, 15, 64)        0         
_________________________________________________________________
conv2d_3 (Conv2D)            (None, 13, 13, 64)        36928     
_________________________________________________________________
activation_3 (Activation)    (None, 13, 13, 64)        0         
_________________________________________________________________
max_pooling2d_1 (MaxPooling2 (None, 6, 6, 64)          0         
_________________________________________________________________
dropout_1 (Dropout)          (None, 6, 6, 64)          0         
_________________________________________________________________
flatten (Flatten)            (None, 2304)              0         
_________________________________________________________________
dense (Dense)                (None, 512)               1180160   
_________________________________________________________________
activation_4 (Activation)    (None, 512)               0         
_________________________________________________________________
dropout_2 (Dropout)          (None, 512)               0         
_________________________________________________________________
dense_1 (Dense)              (None, 10)                5130      
_________________________________________________________________
activation_5 (Activation)    (None, 10)                0         
=================================================================
Total params: 1,250,858
Trainable params: 1,250,858
Non-trainable params: 0
```

訓練経過です。だいたい1エポック9秒程度で終わっています。また検証データの正解率(`val_accuracy`)も77%程度になっています。ちなみに下記の結果はGPUを使用したものですが、CPUの場合は1エポックで43秒程かかりました。GPUは偉大です・・・

```
Train on 50000 samples, validate on 10000 samples
Epoch 1/15
50000/50000 [==============================] - 10s 199us/sample - loss: 1.5545 - accuracy: 0.4320 - val_loss: 1.1938 - val_accuracy: 0.5681
Epoch 2/15
50000/50000 [==============================] - 9s 177us/sample - loss: 1.1665 - accuracy: 0.5840 - val_loss: 0.9679 - val_accuracy: 0.6565
Epoch 3/15
50000/50000 [==============================] - 8s 162us/sample - loss: 1.0074 - accuracy: 0.6419 - val_loss: 0.8711 - val_accuracy: 0.6919
Epoch 4/15
50000/50000 [==============================] - 8s 163us/sample - loss: 0.9178 - accuracy: 0.6771 - val_loss: 0.8321 - val_accuracy: 0.7100
Epoch 5/15
50000/50000 [==============================] - 9s 187us/sample - loss: 0.8527 - accuracy: 0.6999 - val_loss: 0.7774 - val_accuracy: 0.7309
Epoch 6/15
50000/50000 [==============================] - 9s 186us/sample - loss: 0.8061 - accuracy: 0.7175 - val_loss: 0.7574 - val_accuracy: 0.7349
Epoch 7/15
50000/50000 [==============================] - 9s 173us/sample - loss: 0.7724 - accuracy: 0.7287 - val_loss: 0.7334 - val_accuracy: 0.7482
Epoch 8/15
50000/50000 [==============================] - 8s 168us/sample - loss: 0.7343 - accuracy: 0.7417 - val_loss: 0.7231 - val_accuracy: 0.7535
Epoch 9/15
50000/50000 [==============================] - 9s 185us/sample - loss: 0.7121 - accuracy: 0.7495 - val_loss: 0.7061 - val_accuracy: 0.7586
Epoch 10/15
50000/50000 [==============================] - 8s 166us/sample - loss: 0.6878 - accuracy: 0.7577 - val_loss: 0.6602 - val_accuracy: 0.7716
Epoch 11/15
50000/50000 [==============================] - 8s 162us/sample - loss: 0.6672 - accuracy: 0.7675 - val_loss: 0.6990 - val_accuracy: 0.7614
Epoch 12/15
50000/50000 [==============================] - 8s 163us/sample - loss: 0.6462 - accuracy: 0.7729 - val_loss: 0.6837 - val_accuracy: 0.7645
Epoch 13/15
50000/50000 [==============================] - 8s 169us/sample - loss: 0.6322 - accuracy: 0.7777 - val_loss: 0.6593 - val_accuracy: 0.7787
Epoch 14/15
50000/50000 [==============================] - 9s 172us/sample - loss: 0.6197 - accuracy: 0.7826 - val_loss: 0.6672 - val_accuracy: 0.7761
Epoch 15/15
50000/50000 [==============================] - 8s 159us/sample - loss: 0.6035 - accuracy: 0.7887 - val_loss: 0.6811 - val_accuracy: 0.7682
```

損失の経過を表したグラフです。見ての通り10エポック以降から過学習をおこしています。

{% img /gallery/daily/others/loss.png %}

## まとめ

本記事ではLinuxでGPUを用いた機械学習環境を構築する手順を紹介しました。特に初学者から中級者レベルの方が自宅に機械学習環境をシンプルに構築したいシチュエーションを想定して以下の環境構築を一気通貫で実施しました。

- Minikube(Kubernetes)
- JupyterLab
- TensorFlow
- Keras
- CNN(Convolutional Neural Network)

今回なぜLinux+Minikube+JupyterLabの構成にしたかというと、まず機械学習の環境は依存関係が複雑な上に開発のスピードが非常に速いという問題があるからです。特にGPUのドライバのバージョンとCUDAとcuDNNとフレームワーク(TensorFlow等)のバージョンの関係は非常にセンシティブなため、コンテナとして管理した方が非常に安心してバージョンアップができます。特にMinikube(Kubernetes)で管理すれば一つ前のデプロイメントに戻すのも簡単なので**環境構築の試行錯誤とノウハウの蓄積**も簡単になります。そして、本記事ではMinikubeで構築しましたが、複数マシンのKubernetesクラスタで構築すれば複数人でも利用可能な機械学習基盤になり、MLOpsにも繋がっています。

またJupyterLabはいわゆるノートブックの環境で機械学習を環境としては、試行錯誤が容易でコーディングと結果の可視化が両立されており非常に使い勝手が良いのでおすすめです。ノートブックに関しては以前に「{% link 全プログラマに捧ぐ！図解「ノートブック」  https://hinastory.github.io/cats-cats-cats/2019/04/06/understanding-notebook/ %}」という記事を書いたのでそちらを参照してください。

本記事は自分が一番最初にLinuxで機械学習環境を構築しようとした時に、多くの手順に苛まれてなかなかお目当てのディープラーニングまで辿り着けなくてもどかしい思いをした経験から、環境構築からディープラーニングまで一気通貫で記事を構成してみました。

駆け足での説明になってしまいましたが、機械学習に興味がある方の一助になれば幸いです。

## 参考文献

1. {% elink Minikubeを使ってローカルにkubernetes環境を構築 - Qiita https://qiita.com/Esfahan/items/f5c846088281c39f73a4 %}
2. {% elink tensorflow2.0 + kerasでGPUメモリの使用量を抑える方法 - Qiita https://qiita.com/studio_haneya/items/4dfaf2fb2ac44818e7e0 %}
3. {% elink Keras+CNNでCIFAR-10の画像分類 http://kikei.github.io/ai/2018/03/25/cifer10-cnn1.html %}
4. {% elink CIFAR-10のデータセットを用いてCNNの画像認識を行ってみる - AI人工知能テクノロジー https://newtechnologylifestyle.net/cifar-10%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%82%BB%E3%83%83%E3%83%88%E3%82%92%E7%94%A8%E3%81%84%E3%81%A6cnn%E3%81%AE%E7%94%BB%E5%83%8F%E8%AA%8D%E8%AD%98%E3%82%92%E8%A1%8C%E3%81%A3%E3%81%A6%E3%81%BF/ %}

## おまけ

DockerfileはGitで管理しておくと便利です。また、Dockerfileのビルドからデプロイおよびコミットまで自動化しておくと間違いがありません。以下はRubyスクリプトですが自分が使っているものです。ポイントはsedで`kubernetes.io/change-cause`を書換えていることです。こうすることでデプロイメントを更新可能にしています。イメージのバージョンは大きな変更をした場合だけ上げるようにして、ちょっとした変更(機械学習用のライブラリ追加等)はDockerfileをちょっと修正してこのスクリプトを実行するだけで環境のアップデートが終わるので非常に楽です。

{% code lang:ruby %}
#!/usr/bin/env ruby

$VERSION = "v1.13"
system("docker build -t ml/all:#{$VERSION} .") || raise('Failed to docker build')

msg = "\"modified at #{Time.now}\""
cmd = "sed -i -e 's/\\(kubernetes.io\\/change-cause: \\).*$/\\1#{msg}/' ml-deploy.yml"
system(cmd) || raise('Failed to sed')

system("kubectl apply -f ml-deploy.yml") || raise('Failed to sed')
system("git add ml-deploy.yml") || raise('Failed to add')
system("git add Dockerfile") || raise('Failed to add')
system("git commit -m 'modify ml/all image'") || raise('Failed to commit')
{% endcode %}