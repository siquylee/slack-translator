echo off
set sourceDir=..\
set targetDir=C:\glitch\athena
set envSource=.env-dev
mkdir %targetDir%\components
xcopy /e /h /y %sourceDir%\components %targetDir%\components
mkdir %targetDir%\glitch
xcopy /e /h /y %sourceDir%\glitch %targetDir%\glitch
mkdir %targetDir%\locales
xcopy /e /h /y %sourceDir%\locales %targetDir%\locales
mkdir %targetDir%\patch
xcopy /e /h /y %sourceDir%\patch %targetDir%\patch
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
copy /y %sourceDir%\.gitignore %targetDir%
copy /y %sourceDir%\%envSource% %targetDir%\.env
del /q %targetDir%\package-lock.json
del /q %targetDir%\tsconfig.json

echo Push to Glitch
cd %targetDir%
set msg="Deployment on %date% %time%"
git add -A 
git commit -m '%msg%'
git push