import express          from'express';
import request          from 'superagent';
import redis            from 'redis';
import admin            from 'firebase-admin';
import bodyParser       from 'body-parser';

require('dotenv').config();

const client    = redis.createClient();
const app       = express();
const key       = 'data';
const serviceAccount = require("../config-firebase.json");

/** initApp */
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://crud-firebase-7b6a3.firebaseio.com"
});
// 

class Main {

    run(port:number) {

        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())

        let db = admin.database();
        let ref = db.ref("/account");   

        app.get('/list', async function(req:any, res:any){
            let query = db.ref("/account").orderByChild("isActive").equalTo(true);

            await query.on("value", (snapshot) => {
                res.send({success: true, data: snapshot?.val()});
            });
        })
        
        app.post('/create', function(req:any, res:any){
            let data = {
                email: req.body.email, 
                name: req.body.name,
                isActive: req.body.isActive
            };

            let create = ref.push(data, (error) => {
                if(error) {
                    res.send({success: false, message: 'failed!'});
                }
            });
            
            res.send({success: true, message: 'success!', key: create.key});
            
        });

        app.put('/update', function(req:any, res:any){
            
            let collectionRef = ref.child(req.body.key);
            
            let data = { name: req.body.name, email: req.body.email };

            collectionRef.update(data, (error) => {
                if(error) {
                    res.send({success: false, message: 'failed!'});
                }else{
                    res.send({success: true, message: 'success!'});
                }
            });

        });

        app.delete('/delete', function(req:any, res:any){
            
            let accountRef = db.ref('account/' + req.body.key);
            accountRef.remove((error) => {
                if(error) {
                    res.send({success: false, message: 'failed!'});
                }else{
                    res.send({success: true, message: 'success!'});
                }
            })

        });

        app.listen(port, function () {
            console.log(`listening on port ${port}`)
        });
        
    }

    cache(req:any, res:any, next:any) {
        client.get(key, function (err:any, data:any) {
            if (err) throw err;
    
            if (data != null) {
                res.send(data);
            } else {
                next();
            }
        });
    }
}

let main$ = new Main;
main$.run(3000);
