interface Observer {
     onChange(task:Task);

}
class TaskThePanel extends egret.DisplayObjectContainer implements Observer{ 
    myphoto:egret.Bitmap;
    textField:egret.TextField[]=[];
    cancelButton:egret.Bitmap;
    nowtaskList:Task[]=[];
    stageH=1136;
    stageW=640;
    constructor(){
        super();
        this.myphoto=this.createTheBitmapByName("任务panel_png");
        this.cancelButton=this.createTheBitmapByName("取消_png");
        this.cancelButton.touchEnabled=true;
        this.addChild(this.myphoto);
        this.addChild(this.cancelButton);
        this.cancelButton.x=this.cancelButton.width;
        this.cancelButton.y=this.cancelButton.height;
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.IfonButtonClick,this);

    }
    onChange(task:Task) {
        if(task.status>=2&&task.status<4){
            var m=0;
            for(let j=0;j<this.nowtaskList.length;j++){
                if(task.id==this.nowtaskList[j].id){
                    this.nowtaskList.splice(j,1,task);
                    m++;
                }
            }
            if(m==0){
                this.nowtaskList.push(task);
            }

        }if(task.status==4){
            for(let j=0;j<this.nowtaskList.length;j++){
                if(task.id==this.nowtaskList[j].id){
                    this.nowtaskList.splice(j,1);
                    
                }
            }
        }

    }
    IfonButtonClick() {
        this.IfonClose();
    }
    IfonShow() {
        var s=0;
        for(s;s<this.nowtaskList.length&&this.nowtaskList.length!=0;s++){
            var tx=new egret.TextField();
            this.textField.push(tx);
            this.textField[s].text=this.nowtaskList[s].name+"  "+this.nowtaskList[s].desc;
            this.addChild(this.textField[s]);
            this.textField[s].x=50;
            this.textField[s].y=100+100*s;
        }
        
        
    }
    IfonClose() {
        for(let i=0;i<this.textField.length;i++){
            this.removeChild(this.textField[i]);
        }
        this.textField.splice(0,this.textField.length);
        this.parent.removeChild(this);
    }
     private createTheBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

class NPCwrodPanel extends egret.DisplayObjectContainer{ 
    count:number=0;
    textNPC:egret.TextField=new egret.TextField();
    npcname:string;
    textField:egret.TextField=new egret.TextField();;
    myphoto:egret.Bitmap;
    button:egret.Bitmap;
    stageH=1136;
    stageW=640;
    buttonShow=0;
    taskid:string;
    acceptButton:egret.Bitmap;
    cancelButton:egret.Bitmap;
    finishButton:egret.Bitmap;
    constructor(){
        super();
        this.myphoto=this.createTheBitmapByName("对话框_png");
        this.x=0;
        this.y=this.stageH-this.myphoto.height;
        this.acceptButton=this.createTheBitmapByName("接受_png");
        this.cancelButton=this.createTheBitmapByName("取消_png");
        this.finishButton=this.createTheBitmapByName("完成_png");
        this.acceptButton.x=this.finishButton.x=this.stageW-this.acceptButton.width*3-this.x;
        this.acceptButton.y=this.finishButton.y=this.stageH-this.acceptButton.height*2-this.y;
        this.cancelButton.x=this.stageW-this.acceptButton.width*1.5-this.x;
        this.cancelButton.y=this.stageH-this.acceptButton.height*2-this.y;
        this.textNPC.x=30;
        this.textNPC.y=50;
        this.textField.x=30;
        this.textField.y=100;
        this.textField.text="";
        this.addChild(this.myphoto);
        this.addChild(this.textNPC);     
        this.addChild(this.textField); 
        this.addChild(this.cancelButton);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.Ifonclose,this);
        this.acceptButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.IfonButtonClick,this);
        this.finishButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.IfonButtonClick,this);


    }
    public IfonShow() {
        this.count++;  
        this.textNPC.text=this.npcname;
        this.cancelButton.touchEnabled=true;       
    }
    public Ifonclose() {
        if(this.count!=0) {
             if(this.buttonShow==1){
              this.removeChild(this.acceptButton);
              this.buttonShow=0;
               this.acceptButton.touchEnabled=false;
          }
           if(this.buttonShow==2){
              this.removeChild(this.finishButton);
              this.buttonShow=0;
              this.finishButton.touchEnabled=false;
          }
          this.parent.removeChild(this);
          this.count=0;
          this.npcname="";
          this.textField.text="";
          this.cancelButton.touchEnabled=false;
         
        }
    }
    public IfshowMyTask(task:Task){
        this.taskid=task.id;
        this.textField.text=task.desc;
      
        if(task.status==1) {
            this.addChild(this.acceptButton);
            this.buttonShow=1;
            this.acceptButton.touchEnabled=true;
      
        }
        if(task.status==3) {
            this.addChild(this.finishButton);
            this.buttonShow=2;
            this.finishButton.touchEnabled=true;
        }
    }
    IfonButtonClick() {
       
        if(this.buttonShow==1){
            var tas:TaskTheService=TaskTheService.getInstance();
            tas.accept(this.taskid);
            if(this.taskid==tasks[1].id){
                tas.reach(this.taskid);
            }
        }
        if(this.buttonShow==2){
            var tas:TaskTheService=TaskTheService.getInstance();
            tas.finish(this.taskid);
        }
        this.Ifonclose();

    }
    private createTheBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}



class Task {
 id:string;
 name:string;
 desc:string;
 status:TaskStatus;
 fromNPCid:string;
 toNPCid:string;


constructor(id,name,desc,status,fromNPCid,toNPCid) {
    this.id=id;
    this.desc=desc;
    this.name=name;
    this.desc=desc;
    this.status=status;
    this.fromNPCid=fromNPCid;
    this.toNPCid=toNPCid;
}

}

enum TaskStatus {
    UNACCEPTABLE=0,
    ACCEPTABLE=1,
    DURING=2,
    CAN_SUBMIT=3,
    SUBMITTED=4,
}

class NPC extends egret.DisplayObjectContainer implements Observer {
    id:string;
    myname:string;
    emoji:egret.Bitmap;
    myphoto:egret.Bitmap;
    myword:string;
    myPanel:NPCwrodPanel;
    constructor(i:number,npcwp:NPCwrodPanel) {
        super();
        this.id=NPCs[i].id;
        this.myname=NPCs[i].myname;
        this.myphoto=this.createTheBitmapByName(NPCs[i].myphoto);
        this.addChild(this.myphoto);
        this.emoji=this.createTheBitmapByName(emojis[0].name);
        this.addChild(this.emoji);
        this.emoji.x+=this.myphoto.width/5;
        this.emoji.y-=this.myphoto.height/4;
        this.myPanel=npcwp;
        this.myword="点我干嘛快去搞任务啊";
    }
    onChange(task:Task) {
      if(task.fromNPCid==this.id) {
          if(task.status==1)
         this.emoji.texture=RES.getRes(emojis[1].name);   
         if(task.status==2)   
          this.emoji.texture=RES.getRes(emojis[0].name);   
       }
       if(task.toNPCid==this.id&&task.status>1) {
           var i;
           for(i=0;true;i++) {
              if(TaskStatus[TaskStatus[i]]==task.status) {
                   this.emoji.texture=RES.getRes(emojis[i].name);
                   break;
               }
           }
          
       }
    }

    IfonNPCClick() {
        this.myPanel.npcname=this.myname;
        var tas:TaskTheService=TaskTheService.getInstance();
        var ta=tas.getTheTaskBYCustomRule(this.rules1,this);
        if(ta!=null){
   //         console.log(ta.id);
            this.myPanel.IfshowMyTask(ta);
        }
     
    }

    public rules1(tasks:Task[],npc:NPC) {
        var ta:Task;
        for(let i=0;i<tasks.length;i++) {
      //      console.log(tasks[i].id+""+tasks[i].toNPCid);
             if(tasks[i].toNPCid==npc.id) {
                if(tasks[i].status!=0&&tasks[i].status!=4&&tasks[i].status!=1){
                         ta=tasks[i];       
                         return ta;         
            } 
             }
            if(tasks[i].fromNPCid==npc.id) {
                if(tasks[i].status==1){
                         ta=tasks[i];  
                             return ta;                      
                        }
            }
               
        }return null;  
    }
  
    
    private createTheBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}


class TaskTheService {

    public observerList:Observer[]=[];
    public taskList:Task[]=[];
    private static instance;
    private static count =0;
    constructor (){
        TaskTheService.count++;
        if(TaskTheService.count >1){
            throw 'singleton';
        }
    }
    public static getInstance() {
        if(TaskTheService.instance ==null) {
            TaskTheService.instance =new TaskTheService();
        }
        return TaskTheService.instance;
    }

    finish (id:String) {
        for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.SUBMITTED;
                this.notify(ta);
                this.notifyall();
            }
        }
    }
    reach (id:String) {
        for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.CAN_SUBMIT;
                this.notify(ta);
            }
        }
    }
     IfcanAccept (id:String) {
        for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.ACCEPTABLE;
                this.notify(ta);
            }
        }
    }
    accept (id:String) {
         for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.DURING;
                this.notify(ta);
            }
        }

    }
    public getTheTaskBYCustomRule(rule:Function,npc:NPC):Task{
           
            return  rule(this.taskList,npc);
    }
    notify(ta:Task) {
        for(let ob of this.observerList) {
            ob.onChange(ta);
        }
  //      console.log(ta.id,ta.desc,ta.name);
    }
    notifyall(){
      
         for(let ob of this.observerList){
           for(let ta of this.taskList) {
            ob.onChange(ta);
            if(ta.id==tasks[0].id&&ta.status==4){
                for(var ta2 of this.taskList) {
                    if(ta2.id==tasks[1].id&&ta2.status==0){
                        ta2.status=TaskStatus.ACCEPTABLE;
                        console.log("gai");
                        this.notify(ta2);
                    }
                }
                    
            }
         }}
         
    }
}


let tasks= [
    {id:"task_00",name:"no乱点",desc:"请跟右边",fromNPCid:"npc_0",toNPCid:"npc_0"},
    {id:"task_01",name:"来了",desc:"去左边",fromNPCid:"npc_1",toNPCid:"npc_0"},
]

let NPCs=[
    {id:"npc_0",myname:"不送",myphoto:"npc0_01_png"},
    {id:"npc_1",myname:"真的",myphoto:"npc1__01_png"},
]

let emojis=[
    {name:""},
    {name:"叹号_png"},
    {name:"问号灰_png"},
    {name:"问号黄_png"},
    {name:""},
]