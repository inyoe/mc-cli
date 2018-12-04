@echo "Copy Files To Production"

SET targetPath=D:\www\production\release

@CHOICE /M "Copy files to %targetPath%?"

@if errorlevel 2 goto End 
@if errorlevel 1 goto StartCopy


:StartCopy
:: 目录覆盖
@rd %targetPath%\dist\ /S /Q
@xcopy .\dist\* %targetPath%\dist\ /Y /E

@echo Copy Done
@goto end



:end
@echo End
pause
