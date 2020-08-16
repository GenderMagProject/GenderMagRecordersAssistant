#Creating a .xpi

## Creating a .crx
1. Install the GenderMag Recorder's Assistant using the README.md steps
2. Once the extension is loaded, generate the .crx by clicking 'Pack extension'
3. Select the GenderMagRecorderAssistant-master directory
4. The first time you pack the assistant, leave the 'Private Key' field blank. This will prompt you to be asked to create a private key which will generate a PEM file. Subsiquent packings of the extension will use this key. 
5. Click "Pack Extension". If you have previously created a .crx, you will be asked to confirm that you want to proceed and save over your previous .crx.

## Converting the .crx to .xpi
1. Open Firefox and add the Chrome Store Foxified extension. (Menu > Add-ons > Extensions and search "Chrome Store Foxified". See also https://www.thewindowsclub.com/install-chrome-extensions-on-firefox)
2. Open Chrome Store Foxified and click to browse your computer.
3. From your file browser, select the .crx file you previously generated.
4. Click "Add to Firefox". This may take a couple moments to run. 
5. Once you see GenderMag Recorder's Assistant show on the Chrome Store Foxified page, click to save the unsigned file to disk. 
 - Chrome Store Foxified will likely hang in "Checking AMO Credentials". This should not inhibit your progres. 
 - If the 'Unsigned' link does not open a file prompt. Close Firefox and reopen and return to the Chrome Store Foxified Extension. 
6. Open a new tab in firefox and navigate to about:debugging
7. Click "Load Temporary Add-on..." and select the .xpi file you saved. 
8. You should now be able to test GenderMag Recorder in firefox. 
9. To see what is failing in the recorder assistant, use the Browser Console (ctrl+shift+j or Menu > Web Developer > Browser Console)

## Signing the .xpi for distrobution (not recommended until compatibility issues have been resolved)
1. If you have not done so already, create a Firefox Account and log in. 
2. In the browser of your choice, visit https://addons.mozilla.org/en-US/developers/addon/submit/distribution
3. Select your distrobution method, 'On your own' will allow you to personally sign the Recorder's Assistant and download the signed .xpi.
4. Select the unsigned .xpi that Chrome Store Firefoxied generated.
5. Once the .xpi has been verified, you will need to submit a zip or tar of the assistant's source code for security reasons and add additional info for the add-on. 
6. After the signing process is complete, you will be allowed to download the signed .xpi for use/distrobution. 

### Tips for working with Mozilla's Signing Process
- Chrome Store Foxified generates a UUID as part of the conversion process. This UUID will be generated automatically and while compatible with the add-on signing process, it changes with every conversion. 
- Because of this, you will not be able to update the .xpi to a new version within the developer add-on console as Chrome Store Foxified does not seem to have a functional update option once a .crx has been converted. Editing the generated .xpi (to change the UUID) will corrupt the .xpi and prevent a re-upload. If you need to sign a new version of the .xpi, you will need to increment the manifest.json version and re-upload for signing. 