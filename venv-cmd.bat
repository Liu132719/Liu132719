@echo off

call venv.bat

@doskey ll=dir
@doskey pip=python python38\Scripts\pip.exe $*

cmd

