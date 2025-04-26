Web Application Setup Guide.

1. Download and install JDK 17. https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html

2. Download and install Maven. (Has to be the Binary archive for the .bin file, e.g. apache-maven-3.9.9-bin.zip) https://maven.apache.org/download.cgi

3. Add JDK and Maven to System Environment Variables. (Add both of the downloaded bin paths to the "Path" variables. Ensure that there are no existing variables for Java already, like /javapath. If so, you can temporarily remove them. The same goes for old Maven paths.)

4. Download, install and run MariaDB locally. https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.7.2&os=windows&cpu=x86_64&pkg=msi&mirror=klaus2

5. During the installation, set a password for root and remember it. (You can also create a different user, of course.) Then ensure that the MariaDB service is running on your machine.

6. Open a Command Prompt and go to the path where the MariaDB bin folder was created. (Command: cd <path to the MariaDB bin folder>, in my case this was in C:/Program Files/MariaDB 11.7/bin)

7. Connect to MariaDB using this command "mysql -u root -p" and then enter your password. (If you created a different user, use that name instead of "root".)

8. Now create a database called atari_web_game with the command "CREATE DATABASE atari_web_game;" (Or a different name, but you will have to change the name in the application.properties file, "spring.datasource.url=jdbc:mariadb://127.0.0.1:3306/atari_web_game" to match the name of your database.)

9. Now you can either manually download the SourceCode folder from GitHub or use "git clone <link to this repository>" to copy the files over to your desired path.

10. Under "SourceCode\atari_game\src\main\resources", change the name of the file "application-example.properties" to "application.properties" and enter your username and password for MariaDB (username should be root if left unchanged). Additionally, if you used a different name for your database, you can also change that there. Also ensure that MariaDB is running locally on the port: 3306.

11. Then inside the project folder where the pom.xml file is located, run this command in the Command Prompt: "mvn clean install -DskipTests".

12. Now start the API with "mvn spring-boot:run". Check in the Command Prompt where and on which port the API is running, usually "8080". You can check if the API is running by typing this URL in a browser: "localhost:8080/api/players", there should be an empty list.

13. Now you can just drag the .html file "BreakoutWebGame.html" into your browser and try out the game. (The MariaDB service and the API need to be running, don't close the Command Prompt where you started the API.) To try the application on a mobile device, you can host the website with Python, for example, and just access it on your local network and it will work the same.