@ECHO OFF
SETLOCAL
SET MVNW_PATH=%~dp0\.mvn\wrapper\maven-wrapper.jar
IF NOT EXIST "%MVNW_PATH%" (
  echo Downloading Maven Wrapper...
  powershell -Command "Invoke-WebRequest -Uri https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar -OutFile %MVNW_PATH%"
)
java -Dmaven.multiModuleProjectDirectory=%CD% -cp "%MVNW_PATH%" org.apache.maven.wrapper.MavenWrapperMain %*


