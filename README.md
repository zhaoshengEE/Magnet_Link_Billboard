# Magnet Link Billboard


## Authors
  - Mingyuan Du 
  - Zijun Wang
  - Yuhang Xiao
  - Zhaosheng Li


## Table of contents

- [Description](#Description)
- [Files in this repo](#Files-in-this-repo)
- [Frontend URL](#Frontend-URL)
- [Dependencies for this project](#Dependencies-for-this-project)
- [Running the code](#Running-the-code)

## Description

Nowadays, running credit checks on customers becomes an essential step in many situations,
including house renting, bank loaning, credit card application, etc. Doing the credit check can
avoid serving the customer who is not creditable. Having learned the neural network, I decide to build up a two-layer neural network, which is used to classify the customers
as the person with good credit and the person with bad credit.

## Files in this repo

This GitHub repo contains the following folders or files

+ `migrations` folder contains migration files when delploying the smart contract

+ `img` folder contains some relevant images for this project

+ `src` folder contains the smart contract code react components code

+ `test` folder contains the test code for smart contract and some react components

+ `package.json` and `package-lock.json` list out all the dependencies for this DApp

+ `truffle-config.js` is the file when we configure a truffle project at the beginning stage of this work

## Frontend URL
https://www.magnetlinkbillboard.com/
   
***NOTE 1: A MetaMask account is required when using this DApp***

***NOTE 2: The frontend interface only indicates the basic information of seeds except the link. If one wants to acquire the link, he/she needs to click the `Download` button and has enough amount of ether, unless the seed is for free***

## Running the code
1. Clone this repo to your local machine

```bash
git clone https://github.com/zhaoshengEE/Magnet_Link_Billboard.git
```

2. Open the repo with Visual Studio Code, IntelliJ, or other IDE

3. Delete the two `.json` files in `src/abis`

4. Run the following command on the command line of IDE

```bash
truffle migrate --network rinkeby
```
