'use strict';
require('dotenv').config();

const express = require('express');

const superagent = require('superagent');

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

const methodOverride = require('method-override');

const server = express();

server.set('view engine', 'ejs');

const PORT = process.env.PORT;

server.use(express.json());

server.use(methodOverride('_method'));

server.use(express.urlencoded({ extended: true }));

server.get('/searche',(req,res)=>{
res.render('pages/searches/new');
});

server.post('/searche',findtheTeam);
server.post('/add',addtoDB);
server.get('/',showallteam);
server.get('/details/:id',showdetails);
server.put('/update/:id',upd);
server.delete('/delete/:id',deleteteam);





function findtheTeam(req,res){
    let team=req.body.findteam;
    let url =`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${team}`
    superagent.get(url)
    .then(data =>{
        let arrofteams=data.body.teams.map(team=>{
            let newteam=new Teams(team);
            return newteam;
        });
        res.render('pages/searches/show',{team:arrofteams});
    });
}
 
function addtoDB(req,res){
    let {teamname,img_url,found}=req.body;
    let SQL =`INSERT INTO info (teamname,img_url,found) VALUES($1,$2,$3);`;
    let save=[teamname,img_url,found];
    client.query(SQL,save)
    .then(()=>{
        res.redirect('/');
    });
}

function showallteam(req,res){
    let SQL=`SELECT * FROM info ;`;
    client.query(SQL)
    .then(teamdata=>{
        res.render('pages/index',{teamsinfo:teamdata.rows});
    });
    // res.render
}


function showdetails(req,res){
    let id=req.params.id;
    let SQL=`SELECT * FROM info WHERE id=$1;`;
    let save=[id];
    client.query(SQL,save)
    .then(detailData=>{
        
        res.render('pages/books/detail',{teamsDetail:detailData.rows[0]});
        
    });
}

function upd(req,res){
    let id=req.params.id;
    let {teamname,img_url,found} = req.body;

    let SQL=`UPDATE info SET teamname=$1,img_url=$2,found=$3 WHERE id=$4 ;`;
    let save=[teamname,img_url,found,id];
    client.query(SQL,save)
    .then(()=>{
        res.redirect(`/details/${id}`);
    })
}
function deleteteam(req,res){
    let id =req.params.id;
    let SQL=`DELETE FROM info WHERE id=$1;`;
    let save=[id];
    client.query(SQL,save)
    .then(()=>{
        res.redirect(`/`);
    });
}



function Teams(team){
 this.teamname=team.strTeam;  
 this.img_url=team.strStadiumThumb;
 this.found=team.intFormedYear;  
}
client.connect()
    .then(() => {
        server.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );

    });