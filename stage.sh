#!/bin/sh

hexo clean
hexo generate
git add source
git add docs
git status
