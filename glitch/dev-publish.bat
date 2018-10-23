echo off
set currDir=%cd%
set sourceDir=..\
set targetDir=C:\glitch\athena
set envSource=dev.env
set zipCmd=C:\Program Files\7-Zip\7z.exe
set zipFile=G:\Dropbox\glitch\athena.zip

mkdir %targetDir%\components
xcopy /e /h /y %sourceDir%\components %targetDir%\components

mkdir %targetDir%\glitch
xcopy /e /h /y %sourceDir%\glitch %targetDir%\glitch

mkdir %targetDir%\locales
xcopy /e /h /y %sourceDir%\locales %targetDir%\locales

mkdir %targetDir%\plugins
xcopy /e /h /y %sourceDir%\plugins %targetDir%\plugins

mkdir %targetDir%\public
xcopy /e /h /y %sourceDir%\public %targetDir%\public

mkdir %targetDir%\skills
xcopy /e /h /y %sourceDir%\skills %targetDir%\skills

mkdir %targetDir%\views
xcopy /e /h /y %sourceDir%\views %targetDir%\views

copy /y %sourceDir%\*.js %targetDir%
copy /y %sourceDir%\*.json %targetDir%

copy /y %targetDir%\glitch\%envSource% %targetDir%\.env

REM Delete unnecessary files
cd %targetDir%
del /q %targetDir%\glitch\*.bat
del /q %targetDir%\glitch\.env*
del /q %targetDir%\tsconfig.json
del /q %targetDir%\package-lock.json
del /q "%zipFile%"
"%zipCmd%" a -r "%zipFile%" *
cd %currDir%