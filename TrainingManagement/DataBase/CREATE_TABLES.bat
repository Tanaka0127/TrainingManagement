@rem
@rem <CREATE_TABLES.bat>
@rem

:BEGIN
	echo off
	set CRTBL=CREATE_TABLES.txt
	if exist %CRTBL% (
	for /f "delims= " %%I in ( %CRTBL% ) do (
	mysql -u root -ppassw0rd training_management < %%I
	 )
)
:EXIT
	echo on
goto :EOF
