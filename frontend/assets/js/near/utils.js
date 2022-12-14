import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import { async } from 'regenerator-runtime'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: [],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['add_student',' get_student','delete_student',
    'add_course',
     'get_courses',
    ' delete_course',
    ' add_payment',
    'get_payments',
    ' delete_payment']
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

// use this if you need  returns boolean if logged in
const isLoggedIn  = () => {
  return window.walletConnection.isSignedIn();
}
export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}


// try displaying it as  {getAccount } on react
export function getAccount(){
  return window.walletConnection.getAccountId()
}

// export async function set_greeting(message){
//   let response = await window.contract.set_greeting({
//     args:{message: message}
//   })
//   return response
// }

// export async function get_greeting(){
//   let greeting = await window.contract.get_greeting()
//   return greeting
// }
export async function newStudent(name,  course,  reg_no,age,admyear,year){
  if (isLoggedIn()){
    const response = await window.contract.add_student(
      {
        name, 
        course,  
        reg_no,
        age,
        admyear,
        year
      }
    )
    return response
  }
  return null;
}
export async function getStudents(start,limit){
  if(isLoggedIn()){
    const response = await window.contract.get_student({start,limit});
    return [response]
  }
  return [];
}

export async function deleteStudent(id){
  if (isLoggedIn()) {
    // since we are deleting it is not a nessecity to place a variable on it since we will not need a response of the deleted persons
    await window.contract.delete_student({id});
    window.location.reload();
  }
  return null;
}