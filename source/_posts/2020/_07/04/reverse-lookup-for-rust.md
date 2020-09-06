---
title: Rust逆引きサンプル(Rubyコード付き)
thumbnail: /gallery/daily/others/rust-influences.png
categories:
    - Tech
    - Language
tags:
    - Rust
date: 2020-07-04 07:28:45
---

探せば必ずRubyと似た表現がある。それがRustです。

<!-- more -->

## 目次

<!-- toc -->

## オプションの操作

### 整数と「値なし」を同時に表現して、分岐したい (`if let`)

{% code lang:ruby ruby %}
a = 2

if a
  puts "b1 #{a}" # ここを通る
end

a = nil

if a
  puts "b2 #{a}" # ここは通らない
else
  puts "b3"      # ここを通る
end
{% endcode %}


{% code lang:rust rust %}
let mut a = Some(2);

if let Some(x) = a {
    println!("b1: {:?}", x); // ここを通る
}

a = None;

if let Some(y) = a {
    println!("b2: {:?}", y); // ここは通らない
} else {
    println!("b3"); // ここを通る
}
{% endcode %}

### オプションから簡単に値を取り出したい (`unwrap`, `unwrap_or`)

{% code lang:ruby ruby %}
a = 2
x = a + 1     # もしaがnilだとNoMethodErrorが起こる。危険
puts "x=#{x}" # x=3

a = nil
y = (a || 10) + 5
puts "y=#{y}" # y=15
{% endcode %}


{% code lang:rust rust %}
let mut a = Some(2);

let x = a.unwrap() + 1; // もしaがNoneだとpanicする。危険
println!("x={:?}", x);  // x=3

a = None;
let y = a.unwrap_or(10) + 5;
println!("y={:?}", y); // y=15
{% endcode %}

## ベクタの操作

### ベクタの最後に要素を追加/削除したい (`push`, `pop`)

{% code lang:ruby ruby %}
vec = []
vec.push(3)  # 最後に追加
vec.push(7)  # 最後に追加
vec.push(-4) # 最後に追加
puts "vec=#{vec}" # vec=[3, 7, -4]

e = vec.pop # 最後を削除して取り出し
puts "e=#{e}, vec=#{vec}" # e=-4, vec=[3, 7]
{% endcode %}

{% code lang:rust rust %}
let mut vec = vec![];
vec.push(3);  // 最後に追加
vec.push(7);  // 最後に追加
vec.push(-4); // 最後に追加
println!("vec={:?}", vec); // vec=[3, 7, -4]

let e = vec.pop(); // 最後を削除して取り出し
println!("e={:?}, vec={:?}", e, vec); // e=Some(-4), vec=[3, 7]
{% endcode %}

### ベクタの任意の位置に要素を追加/削除したい (`insert`, `remove`)

{% code lang:ruby ruby %}
vec = [3, 7, -4]
vec.insert(1, 99)
puts "vec=#{vec}" # vec=[3, 99, 7, -4]

e = vec.delete_at(2)
puts "e=#{e}, vec=#{vec}" # e=7, vec=[3, 99, -4]
{% endcode %}

{% code lang:rust rust %}
let mut vec = vec![3, 7, -4];
vec.insert(1, 99);
println!("vec={:?}", vec); // vec=[3, 99, 7, -4]

let e = vec.remove(2);
println!("e={:?}, vec={:?}", e, vec); // e=Some(7), vec=[3, 99, -4]
{% endcode %}


### ベクタの結合をしたい (`append`, `concat`)

{% code lang:ruby ruby %}
vec = [1, 2, 3]
vec2 = [4, 5, 6]
vec.push(*vec2) # or vec.concat(vec2)
puts "vec=#{vec}" # vec=[1, 2, 3, 4, 5, 6]

vec = [1, 2, 3]
vec2 = [4, 5, 6]
vec3 = vec + vec2 # or [vec, vec2].flatten
puts "vec=#{vec}, vec2=#{vec2}, vec3=#{vec3}" # vec=[1, 2, 3], vec2=[4, 5, 6], vec3=[1, 2, 3, 4, 5, 6]
{% endcode %}

{% code lang:rust rust %}
let mut vec = vec![1, 2, 3];
let mut vec2 = vec![4, 5, 6];
vec.append(&mut vec2);
println!("vec={:?}, vec2={:?}", vec, vec2);

let mut vec = vec![1, 2, 3];
let mut vec2 = vec![4, 5, 6];
let vec3 = [vec, vec2].concat();
println!("vec3={:?}", vec3); // vec, vec2はムーブされているのでアクセス不可
{% endcode %}

### ベクタの要素にアクセスしたい (`first`, `last`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
first = vec.first
last = vec.last
middle = vec[2]
puts "first=#{first}, last=#{last}, middle=#{middle}" # first=3, last=2, middle-4
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let first = vec.first();
let last = vec.last();
let middle = vec[2];
println!("first={:?}, last={:?}, middle={:?}", first, last, middle); // first=Some(3), last=Some(2), middle=-4
{% endcode %}

### ベクタの任意の範囲を抜き出したい (スライス)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
part1 = vec[...3]
part2 = vec[2...4]
part3 = vec[2..4]
part4 = vec[3..]
puts "part1=#{part1}, part2=#{part2}, part3=#{part3}, part4=#{part4}"
 # part1=[3, 7, -4], part2=[-4, 5], part3=[-4, 5, 2], part4=[5, 2]
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let part1 = &vec[..3];
let part2 = &vec[2..4];
let part3 = &vec[2..=4];
let part4 = &vec[3..];
println!(
    "part1={:?}, part2={:?}, part3={:?}, part4={:?}",
    part1, part2, part3, part4
);
// part1=[3, 7, -4], part2=[-4, 5], part3=[-4, 5, 2], part4=[5, 2]
{% endcode %}

### ベクタを反復処理したい (`for`, `for_each`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
for x in vec do
  puts "x=#{x}"
end

vec.each {|y| puts "y=#{y}"}
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];

for x in &vec {
    println!("x={:?}", x);
}

vec.iter().for_each(|y| println!("y={:?}", y));
{% endcode %}

### 要素数を数えたい (`len`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
length = vec.length
puts "length=#{length}" # length=5
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let length = vec.len();
println!("length={:?}", length); // length=length
{% endcode %}

### 合計値を求めたい (`sum`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
sum = vec.sum
puts "sum=#{sum}" # sum=13
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let sum: i32 = vec.iter().sum();
println!("sum={:?}", sum); // sum=13
{% endcode %}

### 最小値/最大値が欲しい (`min`, `max`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
min = vec.min
max = vec.max
puts "min=#{min}, max=#{max}" # min=-4, max=7
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let min = vec.iter().min();
let max = vec.iter().max();
println!("min={:?}, max={:?}", min, max); // min=Some(-4), max=Some(7)
{% endcode %}

### 条件に最初に一致したものを見つけたい (`find`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
find = vec.find{|x| x > 4}
puts "find=#{find}" # find=7
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let find = vec.iter().find(|&&x| x > 4);
println!("find={:?}", find); // find=Some(7)
{% endcode %}

### 条件に一致するものを全て抜き出したい (`filter`, `retain`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
filtered = vec.filter{|x| x > 4} # 元の`vec`を維持
puts "filtered=#{filtered}, vec=#{vec}" # filtered=[7, 5]

vec.filter!{|x| x > 4} # 元の`vec`を変更
puts "vec(filtered)=#{vec}" # vec(filtered)=[7, 5]
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let filtered: Vec<_> = vec.iter().filter(|&&x| x > 4).collect(); // 元の`vec`を維持
println!("filtered={:?}, vec={:vec}", filtered); // filtered=[7, 5], vec=[3, 7, -4, 5, 2]

vec.retain(|&x| x > 4); // 元の`vec`を変更
println!("vec(filtered)={:?}", vec); // vec(filtered)=[7, 5]
{% endcode %}

### 一つでも条件を満たす要素があるか調べたい (`any`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
any = vec.any?{|x| x > 0}
puts "any=#{any}" # any=true
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let any = vec.iter().any(|&x| x > 0);
println!("any={:?}", any); // any=true
{% endcode %}

### 全ての要素が条件を満たすか調べたい (`all`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
all = vec.all?{|x| x > 0}
puts "all=#{all}" # all=false
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let all = vec.iter().all(|&x| x > 0);
println!("all={:?}", all); // all=false
{% endcode %}

### 絶対値が最小のものを見つけたい (`abs`, `min_by_key`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
abs_min = vec.min_by{|x| x.abs}
puts "abs_min=#{abs_min}" # abs_min=2
{% endcode %}

{% code lang:rust rust %}
let vec= vec![3i32, 7, -4, 5, 2];
let abs_min = vec.iter().min_by_key(|x| x.abs());
println!("abs_min={:?}", abs_min); // abs_min=Some(2)
{% endcode %}

### 各要素を2倍したい (`map`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
doubled = vec.map{|x| x * 2}
puts "doubled=#{doubled}" # doubled=[6, 14, -8, 10, 4]
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3, 7, -4, 5, 2];
let doubled: Vec<_> = vec.iter().map(|&x| x * 2).collect();
println!("doubled={:?}", doubled); // doubled=[6, 14, -8, 10, 4]
{% endcode %}


### 各要素の2乗和を求めたい (`fold`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
square_sum = vec.reduce{|acc, x| acc + x ** 2}
puts "square_sum=#{square_sum}" # square_sum=103
{% endcode %}

{% code lang:rust rust %}
let vec = vec![3i32, 7, -4, 5, 2];
let square_sum = vec.iter().fold(0, |acc, x| acc + x.pow(2));
println!("square_sum={:?}", square_sum); // square_sum=103
{% endcode %}

### 要素をソートしたい (`sort`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
vec.sort!
puts "sorted=#{vec}" # sorted=[-4, 2, 3, 5, 7]
{% endcode %}

{% code lang:rust rust %}
let mut vec = vec![3, 7, -4, 5, 2];
vec.sort();
println!("sorted={:?}", vec); // sorted=[-4, 2, 3, 5, 7]
{% endcode %}

### 絶対値順で要素をソートしたい (`abs`, `sort_by_key`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
vec.sort_by!{|x| x.abs}
puts "sorted=#{vec}" # sorted=[2, 3, -4, 5, 7]
{% endcode %}

{% code lang:rust rust %}
let mut vec = vec![3, 7, -4, 5, 2];
vec.sort_by_key(|x| x.abs());
println!("sorted={:?}", vec); // sorted=[2, 3, -4, 5, 7]
{% endcode %}

### 要素を逆順にしたい (`reverse`)

{% code lang:ruby ruby %}
vec = [3, 7, -4, 5, 2]
vec.reverse!
puts "reversed=#{vec}" # reversed=[2, 5, -4, 7, 3]
{% endcode %}

{% code lang:rust rust %}
let mut vec = vec![3, 7, -4, 5, 2];
vec.reverse();
println!("reversed={:?}", vec); // reversed=[2, 5, -4, 7, 3]
{% endcode %}

## ハッシュマップの操作

### ハッシュマップに要素を追加/削除したい

{% code lang:ruby ruby %}
hash = {}
hash["a"] = 1 # or hash.store("a", 1)
hash["b"] = 5 # or hash.store("b", 5)
hash["c"] = 2 # or hash.store("c", 2)
puts "a=#{hash["a"]}, b=#{hash["b"]}, c=#{hash["c"]}" # a=1, b=5, c=2

hash.delete("c")
puts "hash=#{hash}" # hash={"a"=>1, "b"=>2}
{% endcode %}

{% code lang:rust rust %}
// `use std::collections::HashMap;` が必要
let mut hash = HashMap::new();
hash.insert("a", 1);
hash.insert("b", 5);
hash.insert("c", 2);
println!("a={:?}, b={:?}, c={:?}", hash["a"], hash["b"], hash["c"]); //  a=1, b=5, c=2

hash.remove("a");
println!("x={:?}", x); // hash={"c": 3, "b": 2}
{% endcode %}

### ハッシュマップをリテラルから作成したい(`collect`)

{% code lang:ruby ruby %}
hash = {a: 1, b: 5, c: 2}
puts "hash=#{hash}" # hash={:a=>1, :b=>5, :c=>2}
{% endcode %}

{% code lang:rust rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
println!("hash={:?}", hash); // hash={"a": 1, "b": 5, "c": 2}
{% endcode %}


### ハッシュマップから安全に値を取り出したい(`get`)

{% code lang:ruby ruby %}
hash = {a: 1, b: 5, c: 2}
a = hash[:a]
k = hash[:k] # kは`nil`, hash.fetch(:k)とすると例外になる
puts "a=#{a}" # a=1
puts "k=#{k}" # k=
{% endcode %}

{% code lang:rust rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
let a = hash.get("a");
let k = hash.get("k");

println!("a={:?}", a); // a=Some(1)
println!("k={:?}", 6); // k=None
{% endcode %}

### ハッシュマップを反復処理したい(`for`, `for_each`)

{% code lang:ruby ruby %}
hash = {a: 1, b: 5, c: 2}
for k, v in hash do
  puts "key=#{k}, value=#{v}"
end

hash.each {|k, v| puts "key=#{k}, value=#{v}"}
{% endcode %}

{% code lang:rust rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();

for (k, v) in &hash {
    println!("key={:?}, value={:?}", k, v);
}

hash.iter().for_each(|(k, v)| println!("key={:?}, value={:?}", k, v));
{% endcode %}

### ハッシュマップのキーの存在を確認したい(`contains_key`)

{% code lang:ruby %}
hash = {a: 1, b: 5, c: 2}
exists = hash.has_key?(:b)
puts "exists=#{exists}" #
{% endcode %}

{% code lang:rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
let exists = hash.contains_key("b");
println!("exists={:?}", exists); // exists=true
{% endcode %}

### ハッシュマップの各値を2倍にしたい(`map`)

{% code lang:ruby ruby %}
hash = {a: 1, b: 5, c: 2}
doubled = hash.map{|k, v| [k, v * 2]}.to_h
puts "doubled=#{doubled}"
{% endcode %}

{% code lang:rust rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
let doubled: HashMap<_, _> = hash.iter().hash(|(k, v)| (k, v * 2)).collect();
println!("doubled={:?}", doubled); // doubled={"a": 2, "c": 4, "b": 10}
{% endcode %}

### ハッシュマップの値が奇数のものだけ抜き出したい(`filter`, `retain`)

{% code lang:ruby %}
hash = {a: 1, b: 5, c: 2}
odds = hash.filter{|k, v| v % 2 != 0} # 元の`hash`を維持
puts "odds=#{odds}, hash=#{hash}" # odds={:a=>1, :b=>5}, hash={:a=>1, :b=>5, :c=>2}

hash.filter!{|k, v| v % 2 != 0} # 元の`hash`を変更
puts "odds=#{hash}" # odds={:a=>1, :b=>5}
{% endcode %}

{% code lang:rust rust %}
let mut hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
let odds: HashMap<_, _> = hash.iter().filter(|(_, &v)| v % 2 != 0).collect(); // 元の`hash`を維持
println!("odds={:?}, hash={:?}", odds, hash); // odds={"b": 5, "a": 1}, hash={"a": 1, "b": 5, "c": 2}

hash.retain(|_, &mut v| v % 2 != 0); // 元の`hash`を変更
println!("odds={:?}", hash); // odds={"a": 2, "c": 4, "b": 10}
{% endcode %}

### ハッシュマップのキーだけ取り出したい(`keys`)

{% code lang:ruby ruby %}
hash = {a: 1, b: 5, c: 2}
keys = hash.keys
puts "keys=#{keys}" # keys=[:a, :b, :c]
{% endcode %}

{% code lang:rust rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
let keys: Vec<_> = hash.keys().collect();
println!("keys={:?}", keys); // keys=["c", "b", "a"]
{% endcode %}

### ハッシュマップの値だけ取り出したい(`values`)

{% code lang:ruby ruby %}
hash = {a: 1, b: 5, c: 2}
values = hash.values
puts "values=#{values}" # values=[1, 5, 2]
{% endcode %}

{% code lang:rust rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
let values: Vec<_> = hash.values().collect();
println!("values={:?}", values); // values=[2, 1, 5]
{% endcode %}

### ハッシュマップをベクタに変換したい

{% code lang:ruby ruby %}
hash = {a: 1, b: 5, c: 2}
vec = hash.to_a
puts "vec=#{vec}" # vec=[[:a, 1], [:b, 5], [:c, 2]]
{% endcode %}

{% code lang:rust rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
let vec: Vec<_> = hash.iter().collect();
println!("vec={:?}", vec); // vec=[("c", 2), ("b", 5), ("a", 1)]
{% endcode %}

### ハッシュマップをキーや値でソートしたい(`sort_by_key`)

{% code lang:ruby ruby %}
hash = {a: 1, b: 5, c: 2}
sorted = hash.sort {|a,b| a[0]<=>b[0]} # キーでソート
puts "sort by key: #{sorted}" # [[:a, 1], [:b, 5], [:c, 2]]

sorted = hash.sort {|a,b| a[1]<=>b[1]} # 値でソート
puts "sort by value: #{sorted}" # [[:a, 1], [:c, 2], [:b, 5]]
{% endcode %}


{% code lang:rust rust %}
let hash: HashMap<_, _> = [("a", 1), ("b", 5), ("c", 2)].iter().cloned().collect();
let mut vec: Vec<_> = hash.iter().collect();
vec.sort_by_key(|e| e.0); // キーでソート
println!("sort by key: {:?}", vec); // [("a", 1), ("b", 5), ("c", 2)]

vec.sort_by_key(|e| e.1); // 値でソート
println!("sort by value: {:?}", vec); // [("a", 1), ("c", 2), ("b", 5)]
{% endcode %}


## 文字列の操作

## 参考文献

- [std::iter::Iterator - Rust](https://doc.rust-lang.org/std/iter/trait.Iterator.html)
- [std::vec::Vec - Rust](https://doc.rust-lang.org/std/vec/struct.Vec.html)
- [slice - Rust](https://doc.rust-lang.org/std/primitive.slice.html)