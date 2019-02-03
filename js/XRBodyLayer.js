/*
*   XR BODY LAYER | HOUSE OF VENUS PUBLIC AUGMENTED REALITY KINECTOME
*   
*   author: Patrice-Morgan Ongoly | @starmaker2130 | @ceo.hov
*   title: XR Body Layer
*   version: 0.1.0
*   last modified: Sunday, February 3, 2019 10:19:13 UTC-05:00:00
*   description: a definition for layers that can be attached to an XR Human Body object as described in the pARk 
*   specification v. 0.2.0
*
*/ 

function XRBodyLayer(name, src){
    var self = this;
    /*
    *   name    |   String
    *   src     |   Array (Object) of Objects (name, obj, mtl, png | all Strings, last three are urls)
    */
    if(name==null||src==null){
       throw new Error('Cannot initialize this component without a name or texture source. XR Body Layer pec. v. 0.0.1');
    }
    else{
        this.type = 'xrbodylayer';//|   String
        this.identity = name;   //  |   String
        this.matrix = src;     //  |   Array (| five Objects or null pointers)
        this.socket = null;
        
        console.log(`\nNew XR Component Generated: \n ------------------ \n XRBodyLayer v. 0.0.1 \n type: ${self.type} \n outgoing socket? ${(self.socket!=null)} \n objId: ${self.identity}  \n matrix: ${self.matrix.length}\n ------------------`);
        console.log('matrix raw:');
        console.log(self.matrix);
        console.log('\n');
    }
}