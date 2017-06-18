# HeroAppSeed
This repository holds the seed data for [Angular Hero-Db]("") application. It contains the data and files required to set up a firebase database to be used with **Angular Hero-Db**. 

## Prerequisites

Node.js and npm are essential to Angular development. 
    
<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">
Get it now</a> if it's not already installed on your machine.
 
**Verify that you are running at least node `v4.x.x` and npm `3.x.x`**
by running `node -v` and `npm -v` in a terminal/console window.
Older versions produce errors.

## Cloning the repo

Clone this repo into new project folder (e.g., `herodbseed`).
```shell
git clone https://github.com/8uddishh/HeroAppSeed herodbseed
cd herodbseed

```
Discard the `.git` folder..
```shell
rm -rf .git  # OS/X (bash)
rd .git /S/Q # windows
```
## Install npm packages

> See npm and nvm version notes above

Install the npm packages described in the `package.json` and verify that it works:

```shell
npm install
```
## Set up you firebase account
A google user can open a firebase account for free. Do create a firebase account once done create a firebase project, this can be done by clicking the **Add Project** link in the <a href="https://console.firebase.google.com" target="_blank" title="Firebase Concole">Firebase console</a>. Once created one can view the contents of the project, the left navigation contains two links which we are interested in 1, Database 2, Storage

### Set up Database rules
In the repository under the data folder copy the contents of the **db-rules.txt**. Click on the **Database** link on the left navigation of the firebase project, then click on **Rules** link. Overwrite the default rules with copied rules. The rules we copy sets up the database to have anonymous read but authorized write.

### Set up Storage rules
In the repository under the data folder copy the contents of the **storage-rules.txt**. Click on the **Storage** link on the left navigation of the firebase project, then click on **Rules** link. Overwrite the default rules with copied rules. The rules we copy sets up the database to have anonymous read but authorized write.

### Create a service account
As a google user one is eligible for a google cloud account. Note that the account requires billing info if one has to create new storage buckets. Since we would reuse the storage bucket of our Firebase application, we can skip setting up the billing account. Since the firebase db and storage we created requires user to be authenticated, we need to create a service account. Log into <a href="https://console.cloud.google.com/" target="_blank" title="Firebase Concole">Google cloud platform</a>, the UI should display the firebase project we created in the previous step. 
* Select the project and click on **API Manager** on the left navigation. 
* Click on **Credentials** link on the left navigation and click the **Create credentials** button and select **Service account key**
* Select **New service account**, enter a service account name and select the role as **Project->Owner**
* Let the Key type be the default json
* Clicking on the Create button should download the config key required by our seed project

## Set up the Seed project to use the firebase key
Copy the downloaded json file containing the application key to the seed project. Open the **config.json** in our seed project and set the **key** to the path of the copied app key json. 
**Tomare!!** the project when run creates a seed.js file inside a dist folder, so the path we set for the key property of json has to be relative to that file not the seed.js file at root level. Eg if the app key file say app.key.json is at root level the path would be './../app.key.json' and not './app.key.json'. 
The config also has a property **bucketName** this is the name of the storage bucket of your firebase project.

## Get set Go!!!

Now we are all set to run the seed

```shell
npm run start
```
Once the seed is complete log into your firebase project and validate that the images and data are available.

## Bugs 
Sometimes the certain data might not be updated or can fail, this is however not a regular scenario. Anytime we see a undefined on the console or we do not see the message **Seed job completed** we recommend you run the seed again using 'npm run start'. The seed can be run n number of times and it should not cause any duplications.

##Tomare 
The seed contains super hero images. No copyright infringement is intended, this is only for demo purpose only. There is no live project using these images. Some of the images can be inappropriate for children, so do take proper notice when using them.

We donot intend to update this repository regularly as this is not an utility. So no pull requests please. You are welcome to use this repository make modifications and use it in your own repository.

Thanks n Cheers!!!!











