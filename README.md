# AutoTaskApp

This makes the website "AutoTask" into a stand alone desktop app.
Will need credentials and authcode with PIN to test.

Run the following code to test out without building an exe file
```
npm test
```

Run the following code to build exe file and other files needed
```
nwbuild --platforms win64 --buildDir dist/ src/
```
Output is in same folder as auto-task. 'C:\...\auto-task\dist\autotask-desktop-application\win64'.
Clicking on autotask-desktop-application.exe will open stand alone AutoTask app
