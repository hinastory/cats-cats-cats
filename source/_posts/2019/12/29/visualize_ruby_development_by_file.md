---
title: 【続】Rubyの22年に渡るコミットの歴史を可視化してみた(ファイル編)
thumbnail: /gallery/events/advent-calendar-2019/ruby-viz-file.png
toc: true
categories:
  - Tech
  - Language
tags:
  - Ruby
  - AdventCalendar
  - Flourish
date: 2019-12-29 07:28:45
---
この記事は{% elink Ruby Advent Calendar 2019 https://qiita.com/advent-calendar/2019/ruby %}の19日目の記事です。
(19日目が投稿されなかったので代理投稿します。)

<!-- more -->
## はじめに

本記事は19日目の代理投稿ですが、25日を過ぎて書かれています。そして{% elink 25日目 https://qiita.com/hinastory/items/6fb5da7fe424d1948783 %}の続きです。25日目では作者単位で可視化を行いましたが今回はファイル単位で行ってみたいと思います。

Rubyの開発の主なファイルはトップディレクトリ直下に置かれているので、それらのファイルを対象に集計してみたいと思います。

## ファイル一覧を作成する

まずは22年間の間に存在したファイル一覧を作成したいと思います。これは以下のようなワンライナーでできました。

{% code lang:bash %}
git log --pretty="format:" --name-only --since="23 years ago"|grep -v '/'|grep -v -e '^\.' -e '^\s*$'|sort|uniq > ruby_topdir_files.txt
{% endcode %}

簡単に説明すると`--pretty="format:"`の部分でコミットログの表示の余計な部分を消します。`--name--only`でファイル名だけを表示します。これによって（余計な空行は入りますが）コミットログに現れる全ファイルが取得できました。

次に余計な行の削除です。まずトップディレクトリのみ対象にしたいのでディレクトリのセパレータの`/`が現れている行は除外します。`grep -v '/'`の`-v`は除外オプションです。さらに`grep -v -e '^\.' -e '^\s*$'`でドットファイルと空行を取り除きます。`-e`オプションを用いることで正規表現を用いてファイルを指定できます。

最後にソート(`sort`)して重複行の削除(`uniq`)をすれば、過去22年間で現れた全ファイル一覧(**ruby_topdir_files.txt**)が作成できます。

できたファイルは以下になります。

{% details ファイル名一覧はこちら。 %}
BSDL
CONTRIBUTING.md
COPYING
COPYING.LIB
COPYING.ja
COPYING.jp
ChangeLog
Doxyfile.in
GPL
KNOWNBUGS.rb
LEGAL
LGPL
MANIFEST
Makefile.in
NEWS
README
README.EXT
README.EXT.ja
README.EXT.jp
README.ja
README.ja.md
README.jp
README.md
SECURITY.md
ToDo
acinclude.m4
aclocal.m4
addr2line.c
addr2line.h
appveyor.yml
array.c
ascii.c
ast.c
ast.rb
atomic.h
azure-pipelines.yml
bignum.c
blockinlining.c
builtin.c
builtin.h
call_cfunc.ci
change.log1
class.c
common.mk
compar.c
compile.c
compile.h
complex.c
config.dj
config.guess
config.sub
config_h.dj
config_s.dj
configure
configure.ac
configure.bat
configure.in
constant.h
cont.c
crypt.h
debug.c
debug.h
debug_counter.c
debug_counter.h
defines.h
diff
dir.c
distruby.rb
dln.c
dln.h
dln_find.c
dmydln.c
dmyenc.c
dmyencoding.c
dmyext.c
dmyloadpath.c
dmytranscode.c
dmyversion.c
encindex.h
encoding.c
enum.c
enumerator.c
env.h
error.c
euc_jp.c
eval.c
eval_error.c
eval_error.ci
eval_error.h
eval_intern.h
eval_jump.c
eval_jump.ci
eval_jump.h
eval_load.c
eval_method.c
eval_method.ci
eval_method.h
eval_proc.c
eval_safe.c
eval_safe.ci
eval_safe.h
eval_thread.c
fiber_benchmark.rb
file.c
fnmatch.c
fnmatch.h
gc.c
gc.h
gc.rb
gem_prelude.rb
glob.c
golf_prelude.rb
goruby.c
hash.c
hrtime.h
ia64.S
ia64.s
id.c
id.h
id_table.c
id_table.h
imp.log
inits.c
insn_send.ci
insnhelper.ci
insnhelper.h
insns.def
install-sh
instruby.rb
intern.h
internal.h
io.c
io.h
io.rb
iseq.c
iseq.h
keywords
lex.c
lex.c.blt
lex.c.src
load.c
loadpath.c
localeinit.c
m17n.c
m17n.h
main.c
marshal.c
math.c
mdoc2man.rb
method.h
mini_builtin.c
miniinit.c
missing.h
mjit.c
mjit.h
mjit_compile.c
mjit_internal.h
mjit_worker.c
mkconfig.rb
node.c
node.h
numeric.c
object.c
oniggnu.h
oniguruma.h
opt_insn_unif.def
opt_operand.def
pack.c
pack.rb
parse.c
parse.y
prec.c
prelude.rb
probes.d
probes_helper.h
proc.c
process.c
random.c
range.c
rational.c
re.c
re.h
regcomp.c
regenc.c
regenc.h
regerror.c
regex.c
regex.h
regexec.c
reggnu.c
regint.h
regparse.c
regparse.h
regsyntax.c
ruby-runner.c
ruby.1
ruby.c
ruby.h
ruby_assert.h
ruby_atomic.h
rubyio.h
rubysig.h
rubystub.c
rubytest.rb
runruby.rb
safe.c
sig.h
signal.c
siphash.c
siphash.h
sizes.c
sjis.c
sparc.c
sprintf.c
st.c
st.h
strftime.c
string.c
struct.c
symbol.c
symbol.h
t.rb
test_knownbug.rb
test_symbol.rb
thread.c
thread_native.h
thread_pthread.c
thread_pthread.ci
thread_pthread.h
thread_sync.c
thread_tools.c
thread_win32.c
thread_win32.ci
thread_win32.h
time.c
timev.h
top.sed
trace_point.rb
transcode.c
transcode_data.h
transcode_data_iso_8859.c
transcode_data_japanese.c
transcode_data_one_byte.c
transient_heap.c
transient_heap.h
unicode.c
utf8.c
util.c
util.h
variable.c
variable.h
version.c
version.h
vm.c
vm.h
vm_args.c
vm_backtrace.c
vm_core.h
vm_debug.h
vm_dump.c
vm_eval.cvm_evalbody.c
vm_evalbo
dy.ci
vm_exec.c
vm_exec.h
vm_insnhelper.c
vm_insnhelper.h
vm_macro.def
vm_method.c
vm_opts.h
vm_opts.h.base
vm_trace.c
vsnprintf.c
warning.rb
wercker.yml
yarv.h
yarv_version.h
yarvcore.c
yarvcore.h
{% enddetails %}

## ファイル単位のコミット回数のテーブルを作成する

コードを見て察してください（笑）。今回はカテゴリに拡張子を選択しています。

{% code lang:ruby make_files_activity.rb %}
#!/usr/bin/env ruby

require 'csv'

span = (1998..2019)
header = ["file", "ext", *span] # ヘッダーファイルの作成
table = [header]

# ファイル一覧の読み込み
files = File.open('ruby_topdir_files.txt').readlines.map{|e| e.chomp}

activity = files.map do |file|
  puts file
  commits_history = span.map do |year|
    # ファイル単位でコミットログを絞って行数を`wc-l`で数える
    commits = `git log --since=1998-01-01 --until=#{year}-12-31 --oneline --no-merges #{file} 2>/dev/null | wc -l`.to_i
  end

  # 拡張子の列を作る（トップ30に現れるものだけを表示）
  ext = File.extname(file)
  ext = case ext
  when '.h','.c','.y', '.mk', '.def'  then ext
  when '' then 'no_ext'
  end

  [file, ext, *commits_history]
end

table.push *activity

# CSVファイルに書き込み
CSV.open('ruby_files_activity.csv','w') do |csv|
  table.each do |line|
    csv << line
  end
end
{% endcode %}


以下ができたCSVファイルになります。

{% details ファイルの中身はこちら。 %}
file,ext,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019
BSDL,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,2,2,2,2,2,2,2
CONTRIBUTING.md,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2
COPYING,no_ext,1,2,2,5,7,7,7,7,8,8,8,8,9,9,9,9,9,9,10,11,11,12
COPYING.LIB,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
COPYING.ja,,0,0,0,1,1,1,1,1,2,2,2,2,3,4,4,4,4,4,4,4,4,5
COPYING.jp,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
ChangeLog,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Doxyfile.in,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
GPL,no_ext,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2
KNOWNBUGS.rb,,0,0,0,0,0,0,0,0,0,0,11,14,18,18,23,26,26,29,30,35,37,37
LEGAL,no_ext,0,0,0,8,11,12,13,17,17,19,24,26,30,34,34,34,37,38,44,56,63,66
LGPL,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
MANIFEST,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Makefile.in,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
NEWS,no_ext,0,0,0,0,0,0,0,0,0,0,3,55,138,200,301,435,536,663,769,929,1076,1281
README,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
README.EXT,,1,6,11,13,14,17,21,24,28,30,40,58,62,67,74,90,109,111,111,111,111,111
README.EXT.ja,,0,0,0,2,2,4,6,9,10,12,22,36,41,49,56,71,89,91,91,91,91,91
README.EXT.jp,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
README.ja,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
README.ja.md,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,8,11,12,19,37
README.jp,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
README.md,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,9,16,24,29,53
SECURITY.md,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
ToDo,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
acinclude.m4,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
aclocal.m4,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,5,6,12,13
addr2line.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,7,15,22,30,57,57,61,65,117,128
addr2line.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,3,3,4,4
appveyor.yml,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,29,89,127
array.c,.c,2,10,40,74,105,140,172,188,214,265,351,402,447,477,525,648,681,711,752,789,851,896
ascii.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
ast.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,42
ast.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4
atomic.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
azure-pipelines.yml,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
bignum.c,.c,2,6,33,51,83,104,111,128,142,182,228,259,279,296,331,653,669,674,734,758,785,794
blockinlining.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
builtin.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11
builtin.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9
call_cfunc.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
change.log1,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
class.c,.c,2,6,16,30,55,82,89,94,98,103,117,140,162,178,214,257,280,327,343,350,358,401
common.mk,.mk,0,0,0,0,0,0,9,22,35,143,298,357,421,453,542,612,740,836,935,1044,1190,1329
compar.c,.c,1,4,9,11,16,24,25,28,28,31,35,37,38,38,38,43,47,51,53,53,53,60
compile.c,.c,0,0,0,0,0,0,0,0,0,110,165,200,236,251,296,341,396,500,541,711,892,1056
compile.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
complex.c,.c,0,0,0,0,0,0,0,0,0,0,65,102,116,129,157,168,177,193,218,224,255,280
config.dj,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
config.guess,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
config.sub,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
config_h.dj,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
config_s.dj,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
configure,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
configure.ac,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,158,227
configure.bat,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
configure.in,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
constant.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,3,5,5,6,10,12,12,12,13,20
cont.c,.c,0,0,0,0,0,0,0,0,0,39,51,76,101,129,154,169,191,204,213,271,320,388
crypt.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
debug.c,.c,0,0,0,0,0,0,0,0,0,15,24,31,35,35,37,41,46,48,49,62,63,64
debug.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
debug_counter.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,5,14
debug_counter.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,21,48
defines.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
diff,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
dir.c,.c,2,8,26,57,83,94,136,151,162,171,200,229,246,253,272,305,333,384,395,445,467,481
distruby.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
dln.c,.c,2,5,17,29,49,62,64,70,73,78,93,115,128,132,137,137,143,152,155,155,161,162
dln.h,.h,1,3,5,8,9,10,10,11,11,12,15,16,17,17,17,20,20,20,20,20,20,20
dln_find.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,3,5,6,10,11,15,16,16,16,16
dmydln.c,.c,0,0,0,0,0,0,0,1,1,1,1,1,2,2,3,3,3,3,4,4,5,5
dmyenc.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3
dmyencoding.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
dmyext.c,.c,1,1,1,1,1,1,1,2,2,2,2,2,2,2,4,4,5,5,5,5,5,5
dmyloadpath.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
dmytranscode.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
dmyversion.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
encindex.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,5,5,5
encoding.c,.c,0,0,0,0,0,0,0,0,0,77,179,221,236,252,269,302,318,333,338,339,348,360
enum.c,.c,2,8,13,23,34,43,56,68,77,108,135,171,190,203,228,247,274,305,339,363,386,413
enumerator.c,.c,0,0,0,0,0,0,0,9,19,38,64,88,94,100,155,200,210,216,220,222,255,303
env.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
error.c,.c,2,10,21,37,57,88,105,121,127,146,166,185,209,231,263,287,306,341,364,401,440,488
euc_jp.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval.c,.c,2,25,143,239,371,622,748,863,961,1048,1094,1129,1145,1161,1219,1260,1293,1316,1338,1382,1399,1437
eval_error.c,.c,0,0,0,0,0,0,0,0,0,1,6,11,13,16,21,29,35,42,55,75,91,98
eval_error.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_error.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_intern.h,.h,0,0,0,0,0,0,0,0,0,29,53,65,70,75,80,88,95,111,116,145,147,152
eval_jump.c,.c,0,0,0,0,0,0,0,0,0,1,7,8,8,12,14,17,18,19,20,27,27,30
eval_jump.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_jump.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_load.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_method.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_method.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_method.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_proc.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_safe.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_safe.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_safe.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
eval_thread.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
fiber_benchmark.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
file.c,.c,2,11,43,83,125,171,196,235,257,280,334,384,452,465,506,559,608,653,673,722,736,775
fnmatch.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
fnmatch.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
gc.c,.c,2,11,53,84,116,169,195,228,257,308,406,449,514,557,663,1013,1185,1308,1363,1432,1518,1723
gc.h,.h,0,0,0,0,0,0,0,0,0,7,8,12,15,17,22,26,29,33,33,36,36,47
gc.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2
gem_prelude.rb,,0,0,0,0,0,0,0,0,0,6,18,31,41,45,45,45,45,46,47,47,47,48
glob.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
golf_prelude.rb,,0,0,0,0,0,0,0,0,0,11,17,19,19,22,22,23,23,23,23,24,25,26
goruby.c,.c,0,0,0,0,0,0,0,0,0,1,2,3,3,5,6,7,8,8,9,10,10,10
hash.c,.c,2,12,41,61,89,129,146,160,175,195,235,266,289,311,351,448,486,524,562,612,659,733
hrtime.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6
ia64.S,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
ia64.s,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
id.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
id.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
id_table.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,21,24,24,33
id_table.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,5,5,13
imp.log,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
inits.c,.c,2,4,6,7,8,11,11,14,14,30,37,37,37,38,39,41,44,45,45,47,54,64
insn_send.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
insnhelper.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
insnhelper.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
insns.def,.def,0,0,0,0,0,0,0,0,0,78,107,135,153,166,216,240,249,278,301,351,420,455
install-sh,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
instruby.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
intern.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
internal.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,30,107,251,317,405,509,597,718,831
io.c,.c,2,14,73,106,177,253,358,398,423,509,799,912,1020,1167,1277,1344,1410,1471,1505,1576,1629,1683
io.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
io.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
iseq.c,.c,0,0,0,0,0,0,0,0,0,43,77,112,135,150,187,214,258,317,340,390,478,536
iseq.h,.h,0,0,0,0,0,0,0,0,0,0,3,7,11,15,19,23,29,50,55,69,101,120
keywords,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
lex.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
lex.c.blt,,0,0,0,0,0,0,0,0,0,6,8,9,9,9,9,9,9,11,13,15,16,16
lex.c.src,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
load.c,.c,0,0,0,0,0,0,0,0,0,5,20,37,54,67,90,114,126,150,161,184,195,221
loadpath.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,5,5
localeinit.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,6,9,12,17,18,18
m17n.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
m17n.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
main.c,.c,1,3,7,8,11,13,14,18,19,31,36,36,37,37,39,39,39,39,39,41,41,42
marshal.c,.c,1,8,28,52,77,110,119,124,131,161,190,224,244,252,278,304,328,345,351,357,370,388
math.c,.c,2,4,7,11,17,21,23,24,30,35,52,68,78,84,85,94,103,119,136,144,147,150
mdoc2man.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
method.h,.h,0,0,0,0,0,0,0,0,0,0,0,9,15,18,38,46,48,93,94,104,119,139
mini_builtin.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12
miniinit.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,6,6,6,6,7
missing.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
mjit.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,195,235
mjit.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28,47
mjit_compile.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40,69
mjit_internal.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
mjit_worker.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,57,110
mkconfig.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
node.c,.c,0,0,0,0,0,0,0,0,0,0,0,2,4,9,11,11,15,33,41,90,117,150
node.h,.h,2,6,21,29,40,52,63,74,81,88,90,98,104,110,117,121,126,141,141,177,204,228
numeric.c,.c,2,6,22,39,68,104,118,135,152,197,245,288,324,368,399,447,484,504,646,685,715,739
object.c,.c,2,7,39,66,102,139,165,183,211,237,268,293,315,338,393,452,482,507,528,557,588,618
oniggnu.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
oniguruma.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
opt_insn_unif.def,.def,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
opt_operand.def,.def,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
pack.c,.c,2,6,20,32,50,65,77,83,92,102,126,129,164,171,181,212,224,228,238,243,252,259
pack.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
parse.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
parse.y,.y,2,13,79,139,239,309,366,429,471,647,762,829,882,928,996,1060,1197,1287,1376,1606,1806,2023
prec.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
prelude.rb,,0,0,0,0,0,0,0,0,0,4,6,7,11,12,13,13,14,17,19,29,35,42
probes.d,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,11,11,12,12,12,12,12
probes_helper.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,7,9,9,10,11,11
proc.c,.c,0,0,0,0,0,0,0,0,0,44,79,120,138,162,201,258,295,374,403,447,479,543
process.c,.c,2,8,27,45,61,94,130,145,158,190,266,306,331,382,532,616,679,715,732,760,857,887
random.c,.c,2,8,17,18,27,33,34,42,44,50,60,94,125,138,153,187,192,223,252,260,280,290
range.c,.c,2,8,18,29,50,64,70,84,87,106,125,145,147,153,165,193,199,212,219,224,257,275
rational.c,.c,0,0,0,0,0,0,0,0,0,0,69,105,118,125,144,167,176,180,239,258,291,308
re.c,.c,2,10,36,55,93,117,137,146,158,247,324,347,371,379,394,411,434,444,480,488,508,525
re.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
regcomp.c,.c,0,0,0,0,0,0,8,13,20,24,26,32,42,47,50,53,55,58,66,68,70,70
regenc.c,.c,0,0,0,0,0,0,3,6,7,14,29,33,35,35,37,39,41,43,50,51,51,51
regenc.h,.h,0,0,0,0,0,0,3,5,6,18,31,32,34,34,35,36,40,41,47,48,49,49
regerror.c,.c,0,0,0,0,0,0,3,6,11,17,20,25,25,25,27,27,28,28,30,30,31,32
regex.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
regex.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
regexec.c,.c,0,0,0,0,0,0,11,15,24,27,41,45,50,52,55,58,63,67,72,76,77,78
reggnu.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
regint.h,.h,0,0,0,0,0,0,9,12,17,27,38,42,47,50,52,56,60,63,68,69,69,69
regparse.c,.c,0,0,0,0,0,0,12,22,30,37,48,65,70,74,87,90,93,95,100,103,151,154
regparse.h,.h,0,0,0,0,0,0,3,6,10,13,17,19,20,21,22,23,24,25,26,27,28,28
regsyntax.c,.c,0,0,0,0,0,0,0,0,0,1,2,3,3,3,4,4,4,4,5,5,5,5
ruby-runner.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,4,11,12
ruby.1,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
ruby.c,.c,2,15,38,57,72,85,96,114,122,177,277,327,348,375,410,430,448,481,523,546,580,603
ruby.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
ruby_assert.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,4,6
ruby_atomic.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,14,16,23,23,23,26,26
rubyio.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
rubysig.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
rubystub.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2
rubytest.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
runruby.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
safe.c,.c,0,0,0,0,0,0,0,0,0,0,2,3,4,5,5,9,12,18,18,25,25,28
sig.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
signal.c,.c,1,5,17,29,41,52,56,72,78,104,133,146,161,181,205,222,273,284,290,313,346,362
siphash.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,5,6,6,6,7,7,7
siphash.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,4,5,5
sizes.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
sjis.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
sparc.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4,5,5,5,5,6,6,6
sprintf.c,.c,2,7,14,20,30,37,46,63,71,85,118,130,143,145,156,163,184,193,202,222,226,229
st.c,.c,1,4,14,18,25,28,30,39,44,57,63,78,80,85,109,123,141,152,163,177,192,206
st.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
strftime.c,.c,0,0,0,0,0,0,0,0,0,0,27,37,46,55,63,64,64,64,73,76,85,85
string.c,.c,2,14,54,94,134,188,231,244,298,417,637,726,791,824,883,980,1096,1184,1304,1422,1487,1553
struct.c,.c,2,7,21,30,42,54,62,74,81,92,102,117,122,126,141,160,176,195,199,211,225,236
symbol.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,39,41,44,48,59
symbol.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,11,13,13,15,21
t.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
test_knownbug.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
test_symbol.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
thread.c,.c,0,0,0,0,0,0,0,0,0,85,187,244,284,371,489,556,592,639,664,765,880,937
thread_native.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
thread_pthread.c,.c,0,0,0,0,0,0,0,0,0,5,39,57,79,148,179,215,236,255,261,271,385,394
thread_pthread.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
thread_pthread.h,.h,0,0,0,0,0,0,0,0,0,6,8,8,10,17,17,20,24,25,25,25,33,33
thread_sync.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,15,32,68,74
thread_tools.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
thread_win32.c,.c,0,0,0,0,0,0,0,0,0,3,29,34,49,67,74,83,88,91,93,103,118,123
thread_win32.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
thread_win32.h,.h,0,0,0,0,0,0,0,0,0,6,9,9,10,11,12,15,16,16,16,16,16,16
time.c,.c,2,7,33,54,75,94,104,112,128,144,174,230,297,325,344,373,397,408,443,455,510,553
timev.h,.h,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3,6,6,6,6,12,15
top.sed,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
trace_point.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2
transcode.c,.c,0,0,0,0,0,0,0,0,0,20,274,303,317,336,341,356,362,369,372,373,380,384
transcode_data.h,.h,0,0,0,0,0,0,0,0,0,7,54,61,63,63,64,65,65,67,67,67,67,67
transcode_data_iso_8859.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
transcode_data_japanese.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
transcode_data_one_byte.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
transient_heap.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,23
transient_heap.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,10
unicode.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
utf8.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
util.c,.c,2,4,14,23,33,40,48,51,57,66,85,103,126,132,134,140,143,148,153,157,169,170
util.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
variable.c,.c,2,9,31,57,76,111,119,132,144,166,188,213,229,260,279,310,332,370,387,402,439,492
variable.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1
version.c,.c,2,4,6,8,9,10,12,14,15,18,26,28,34,35,37,42,43,49,50,50,56,61
version.h,.h,2,14,134,247,446,727,1042,1355,1611,1912,2282,2641,3007,3372,3736,4105,4471,4845,5214,5580,5944,6302
vm.c,.c,0,0,0,0,0,0,0,0,0,91,164,199,249,285,377,437,503,592,620,733,809,884
vm.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
vm_args.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,30,39,64,89,143
vm_backtrace.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,41,51,59,64,84,91,102
vm_core.h,.h,0,0,0,0,0,0,0,0,0,17,71,95,124,156,232,270,319,393,421,518,608,671
vm_debug.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,3
vm_dump.c,.c,0,0,0,0,0,0,0,0,0,20,38,51,70,78,103,117,129,148,155,178,187,195
vm_eval.cvm_evalbody.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
vm_evalbo,no_ext,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
dy.ci,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
vm_exec.c,.c,0,0,0,0,0,0,0,0,0,0,3,6,7,9,15,18,21,22,23,29,30,30
vm_exec.h,.h,0,0,0,0,0,0,0,0,0,0,2,3,7,8,14,24,24,24,24,33,41,46
vm_insnhelper.c,.c,0,0,0,0,0,0,0,0,0,1,45,84,117,157,256,315,347,442,478,583,691,831
vm_insnhelper.h,.h,0,0,0,0,0,0,0,0,0,0,5,16,17,23,37,48,49,64,68,81,106,120
vm_macro.def,.def,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
vm_method.c,.c,0,0,0,0,0,0,0,0,0,0,12,53,73,93,138,189,211,279,294,317,343,387
vm_opts.h,.h,0,0,0,0,0,0,0,0,0,6,10,10,10,10,13,14,14,17,17,18,20,23
vm_opts.h.base,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
vm_trace.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,46,80,95,108,115,163,184,193
vsnprintf.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,16,20,23,26,29,33,35,37,38,40
warning.rb,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2
wercker.yml,,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
yarv.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
yarv_version.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
yarvcore.c,.c,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
yarvcore.h,.h,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
{% enddetails %}

## Flourishで可視化してみる

今回も前回と同じように{% elink Bar chart race https://app.flourish.studio/@flourish/bar-chart-race/10 %}を用いています。

{% img /gallery/events/advent-calendar-2019/ruby-viz-file.png %}

## 完成した可視化

以下が完成した可視化です。1998年からのファイル単位の累計コミット数のチャートです。

- {% elink ruby-viz-file-total | Flourish https://public.flourish.studio/visualisation/1158165/ %}

<div class="flourish-embed" data-src="visualisation/1158165"></div><script src="https://public.flourish.studio/resources/embed.js"></script>

## まとめ

ファイル単位の可視化はRubyの開発の歴史をご存知の方ほどより楽しめるものになっていると思います。例えば`parse.y`が安定の強さだったり、RubyがVM化した2006年あたりからファイル構成が変わったりしています。`version.h`はわざわざ言及するまでもないですね・・・

この記事は当初は書く予定はなかったのですが、Rubyアドベントカレンダーが埋まらないのが悔しくて、思いつきで2時間ほどで書きました。でも、まぁ結果的に面白い可視化ができてよかったと思います。

本記事が、Ruby好きの方々の一助になれば幸いです。