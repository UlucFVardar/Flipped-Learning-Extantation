# Flipped Learning Chrome Extantaion 

The Idea of th project is, video conferencing in a chat room as a whole class of student and teacher log-in remotely.

In addition, required of flipped education, according to the teacher wants, the students can go to a special chat rooms to discuss the subject as pairs. 

When the teacher finishes the discussion, the students called re-back automatically again to the general classroom chat room.


### Diagram The Project : 
 ![alt text](https://raw.githubusercontent.com/UlucFVardar/Flipped-Learning-Extantation/master/Flipped.png)


#### Project Plan;
* Video stream API is required
* User-types html pages 
* Log-in management
* Node.js websoccet server 
* In html client connection 2 server
    * Server endpoint generation (openning to web)
    * Need of synchronization
* Macth Class button Integration
* Macth - Back Class button Integration

---
###### Solving stages of the problem

> For video streaming Jitsi  ![alt
text](https://www.babblevoice.com/img/jitsi/jitsi.png)

> Using AWS Lambda Log-in management and ngrok end-point updates can be delivered to clients.

> Websoccet Node.js Server can manage all trafic of the system.
        - With storing to connections online students can be show to the admin.
        - Flipped buttons added with using this tech.


---
## To DO list

1. Our Web Soccet server is not enough this app this is only for demo.
    * SignalR techs will implement for this app in the second version.
2. Lecturer can also be enter the discusses chat rooms with the will of paired student (with the alert of them)









