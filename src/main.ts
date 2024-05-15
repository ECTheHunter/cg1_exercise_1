// external dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import RenderWidget from './lib/rendererWidget';
import { Application, createWindow, Window } from './lib/window';

import * as helper from './helper';
// put your imports here

/*******************************************************************************
 * Main entrypoint. Previouly declared functions get managed/called here.
 * Start here with programming.
 ******************************************************************************/

var camera: THREE.PerspectiveCamera;
var controls: OrbitControls;
var rendererDiv: Window;




function main(){
    var root = Application("Robot");
  	root.setLayout([["renderer"]]);
    root.setLayoutColumns(["100%"]);
    root.setLayoutRows(["100%"]);

    // ---------------------------------------------------------------------------
    // create RenderDiv
    rendererDiv = createWindow("renderer");
    root.appendChild(rendererDiv);

    // create renderer
    var renderer = new THREE.WebGLRenderer({
        antialias: true,  // to enable anti-alias and get smoother output
    });

    // important exercise specific limitation, do not remove this line
    THREE.Object3D.DEFAULT_MATRIX_AUTO_UPDATE = false;

   
    // create scene
    var scene = new THREE.Scene();
    // manually set matrixWorld
    scene.matrixWorld.copy(scene.matrix);

    var axeshelper = new THREE.AxesHelper(3);
    var selectedmesh = new THREE.Mesh();
    var currentindex = -1;
    var geometry = new THREE.BoxGeometry( 0.2, 0.5, 0.1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var bodyjoint = new THREE.Object3D();
    bodyjoint.matrix = new THREE.Matrix4();
    scene.add(bodyjoint); 
    var bodymesh = new THREE.Mesh(geometry, material );
    bodyjoint.add(bodymesh);
    bodymesh.matrix = new THREE.Matrix4();
    
    var headjoint = new THREE.Object3D();
    var rightarmjoint = new THREE.Object3D();
    var leftarmjoint = new THREE.Object3D();
    var rightlegjoint = new THREE.Object3D();
    var leftlegjoint = new THREE.Object3D();
    bodymesh.add(headjoint,rightarmjoint,leftarmjoint,rightlegjoint,leftlegjoint);   
    headjoint.matrix = new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, 0.275, 0, 0, 1, 0, 0, 0, 0, 1);
    
  
    rightarmjoint.matrix = new THREE.Matrix4(1, 0, 0, 0.2, 0, 1, 0, 0.1, 0, 0, 1, 0, 0, 0, 0, 1);
  
    leftarmjoint.matrix = new THREE.Matrix4(1, 0, 0, -0.2, 0, 1, 0, 0.1, 0, 0, 1, 0, 0, 0, 0, 1);
    
    rightlegjoint.matrix = new THREE.Matrix4(1, 0, 0, 0.3, 0, 1, 0, -0.3, 0, 0, 1, 0, 0, 0, 0, 1);
  
    leftlegjoint.matrix = new THREE.Matrix4(1, 0, 0, -0.3, 0, 1, 0, -0.3, 0, 0, 1, 0, 0, 0, 0, 1);
    
    var rightarmmesh = new THREE.Mesh(geometry, material );
    rightarmjoint.add(rightarmmesh);
    rightarmmesh.matrix = new THREE.Matrix4(1, 0, 0, 0.1, 0, 1, 0, 0.1, 0, 0, 1, 0, 0, 0, 0, 1);
    var leftarmmesh = new THREE.Mesh(geometry, material );
    leftarmjoint.add(leftarmmesh);
    leftarmmesh.matrix = new THREE.Matrix4(1, 0, 0, -0.1, 0, 1, 0, 0.1, 0, 0, 1, 0, 0, 0, 0, 1);
    var leftlegmesh = new THREE.Mesh(geometry, material );
    leftlegjoint.add(leftlegmesh);
    leftlegmesh.matrix = new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, -0.3, 0, 0, 1, 0, 0, 0, 0, 1);
    var rightlegmesh = new THREE.Mesh(geometry, material );
    rightlegjoint.add(rightlegmesh);
    rightlegmesh.matrix = new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, -0.3, 0, 0, 1, 0, 0, 0, 0, 1);
    var headmesh = new THREE.Mesh(geometry, material );
    headjoint.add(headmesh);
    headmesh.matrix = new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, 0.3, 0, 0, 1, 0, 0, 0, 0, 1);
    var rightfootjoint = new THREE.Object3D();
    rightfootjoint.matrix = new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, -0.1, 0, 0, 1, 0.1, 0, 0, 0, 1);
    var leftfootjoint = new THREE.Object3D();
    leftfootjoint.matrix = new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, -0.1, 0, 0, 1, 0.1, 0, 0, 0, 1);
    var rightfootmesh = new THREE.Mesh(geometry, material );
    rightlegmesh.add(rightfootjoint);
    
    rightfootmesh.matrix = new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0.05, 0, 0, 0, 1);
    rightfootjoint.add(rightfootmesh);
    var leftfootmesh = new THREE.Mesh(geometry, material );
    leftlegmesh.add(leftfootjoint);
    
    leftfootmesh.matrix = new THREE.Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0.05, 0, 0, 0, 1);
    leftfootjoint.add(leftfootmesh);

    var axisbool = false;
    updatevalues(bodyjoint);
    document.addEventListener('keyup', (ev:KeyboardEvent)=>{
      if(ev.code == "KeyS"){
        if(selectedmesh.parent==null){
      
          if(axisbool==true){
            selectedmesh.remove(axeshelper);
          }
          selectedmesh.material = material;
          selectedmesh = bodymesh;
          selectedmesh.material = new THREE.MeshBasicMaterial( { color: 0xf11f00 } );
          if(axisbool==true){
            selectedmesh.add(axeshelper);
            axeshelper.matrixWorld.copy(selectedmesh.parent!.matrixWorld);
          }
          
        }
        else{
          
          var childrenlist = selectedmesh.children[0]?.children;
          if(childrenlist[0] instanceof THREE.Mesh){
            if(axisbool==true){
              selectedmesh.parent.remove(axeshelper);
            }
            selectedmesh.material = material;
            selectedmesh = childrenlist[0];
            currentindex=0;
            selectedmesh.material = new THREE.MeshBasicMaterial( { color: 0xf11f00 } );
         
            if(axisbool==true){
              selectedmesh.parent!.add(axeshelper);
              axeshelper.matrixWorld.copy(selectedmesh.parent!.matrixWorld);
            }
          }
          
        }
      }
      else if(ev.code =="KeyW"){
        if(selectedmesh.parent?.parent instanceof THREE.Mesh){
          if(axisbool==true){
            selectedmesh.remove(axeshelper);
          }
          selectedmesh.material = material;
          selectedmesh = selectedmesh.parent.parent;
          currentindex=-1;
          selectedmesh.material = new THREE.MeshBasicMaterial( { color: 0xf11f00 } );
        }
        
        if(axisbool==true){
          selectedmesh.parent!.add(axeshelper);
          axeshelper.matrixWorld.copy(selectedmesh.parent!.matrixWorld);
        }
      }
      else if(ev.code == "KeyA"){

       
        try{
          
          currentindex--;
       
          if(selectedmesh.parent != null){
            if(currentindex<0)
            {
              currentindex=0;
  
            }
            var currentmesh=selectedmesh.parent.parent?.children[currentindex].children[0];
            if(currentmesh instanceof THREE.Mesh){
              if(axisbool==true){
                selectedmesh.remove(axeshelper);
              }
              selectedmesh.material = material;
              selectedmesh = currentmesh;
              selectedmesh.material = new THREE.MeshBasicMaterial( { color: 0xf11f00 } );
              if(axisbool==true){
                selectedmesh.parent!.add(axeshelper);
                axeshelper.matrixWorld.copy(selectedmesh.parent!.matrixWorld);
              }
      
            }
          }
          
        }
        catch(error){
          
        }
       
      }
      else if(ev.code == "KeyD"){

       
        try{
          currentindex++;
         
         
          if(selectedmesh.parent?.parent != null){
            if(currentindex>selectedmesh.parent.parent.children.length-2)
            { 
              if(selectedmesh.parent.parent.children[selectedmesh.parent.parent.children.length-1].type == "AxesHelper"){
                currentindex=selectedmesh.parent.parent.children.length-2;
                
              }
              else{
                currentindex=selectedmesh.parent.parent.children.length-1;
              }
              
            }
            if(axisbool==true){
              selectedmesh.parent?.remove(axeshelper);
            }
            var currentmesh1=selectedmesh.parent.parent.children[currentindex].children[0];
            if(currentmesh1 instanceof THREE.Mesh){
              selectedmesh.material = material;
              selectedmesh = currentmesh1;
              selectedmesh.material = new THREE.MeshBasicMaterial( { color: 0xf11f00 } );
      
            }
            if(axisbool==true){
              selectedmesh.parent?.add(axeshelper);
              axeshelper.matrixWorld.copy(selectedmesh.parent!.matrixWorld);
            }
          }
        }
        catch(error){
          
        }
       
      }
      else if(ev.code == "KeyC"){
       if(selectedmesh.parent!=null){
        if(axisbool==false){
          selectedmesh.parent?.add(axeshelper);
          axisbool=true;
          try {
            axeshelper.matrixWorld.copy(selectedmesh.parent!.matrixWorld);
          } catch (error) {
            
          }
         }
         else{
          selectedmesh.parent?.remove(axeshelper);
          axisbool=false;
         }
       }
       

      }
      else if(ev.code == "ArrowRight")
      {
        rotatetheobjectY();
      }
      else if(ev.code == "ArrowLeft")
      {
        rotatetheobjectY();

      }
      else if(ev.code == "ArrowUp")
      {
       rotatetheobjectX();
      
      }
      else if(ev.code == "ArrowDown")
      {
        rotatetheobjectX();
      }
      function rotatetheobjectX() {
        var joint = selectedmesh.parent;
        joint?.matrixWorld.copy(joint.parent!.matrixWorld); // Reset matrixWorld to the parent's matrixWorld
    
        // Rotate around X-axis
        var rotationMatrix = rotateobjectX(0.3);
        joint?.matrix.multiply(rotationMatrix);
    
        // Update the world matrix recursively
        updatevalues(joint!);
    }
    
    function rotatetheobjectY() {
        var joint = selectedmesh.parent;
        joint?.matrixWorld.copy(joint.parent!.matrixWorld); // Reset matrixWorld to the parent's matrixWorld
    
        // Rotate around Y-axis
        var rotationMatrix = rotateobjectY(0.3);
        joint?.matrix.multiply(rotationMatrix);
    
        // Update the world matrix recursively
        updatevalues(joint!);
    }
    
    }
    )
    function updatevalues(object: THREE.Object3D) {
      if (object.parent) {
          // Multiply the local matrix with the parent's matrix
          object.matrixWorld.multiplyMatrices(object.parent.matrixWorld, object.matrix);
      } else {
          // If there is no parent, just copy the local matrix to matrixWorld
          object.matrixWorld.copy(object.matrix);
      }
  
      // Update children recursively
      object.children.forEach((element) => {
          updatevalues(element);
      });
  
    }
    
    function rotateobjectY(θ: number){
      return new THREE.Matrix4(
        Math.cos(θ), 0, -Math.sin(θ), 0,
        0, 1, 0, 0,
        Math.sin(θ), 0, Math.cos(θ), 0,
        0, 0, 0, 1
      );
    }
    
    function rotateobjectX(θ: number){
      return new THREE.Matrix4(
        1, 0, 0, 0,
        0, Math.cos(θ), -Math.sin(θ), 0,
        0, Math.sin(θ), Math.cos(θ), 0,
        0, 0, 0, 1
      );
    }

    helper.setupLight(scene);

    // create camera
    camera = new THREE.PerspectiveCamera();
    helper.setupCamera(camera, scene);

    // create controls
    controls = new OrbitControls(camera, rendererDiv);
    helper.setupControls(controls);

    // start the animation loop (async)
    var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
    wid.animate();
    
}
// call main entrypoint
main();
