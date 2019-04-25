#!/bin/sh

hexo generate
git add source
git add docs
git status
