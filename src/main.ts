import admin   from 'firebase-admin';
require('dotenv').config();
const serviceAccount = require("../config-firebase.json");

class Main {

    run(port:number) {

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://crud-firebase-7b6a3.firebaseio.com"
          });
        
        let db = admin.database();
        let ref = db.ref("/account");

        /** save data */
        ref.child('daniel').set({email: 'daniel@gmail.com', name: 'daniel'}, (error) => {
            this.callback(error);
        });
        
    }

    callback(error: any) {
        if (error) {
            console.log("Error: " + error);
        } else {
            console.log("Success.");
        }
    }
}

let main$ = new Main;
main$.run(3000);
