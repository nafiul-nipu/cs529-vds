/* author: Andrew Burks */
"use strict";
/* Create a Threejs scene for the application */

/* Get or create the application global variable */
var App = App || {};

/* Create the scene class */
const Scene = function(options) {

    // setup the pointer to the scope 'this' variable
    const self = this;

    // scale the width and height to the screen size
    const width = d3.select('.particleDiv').node().clientWidth ;
    const height = width  * 0.85;

    // create the scene
    self.scene = new THREE.Scene();
    //self.scene.fog = new THREE.Fog(color, near, far);
    self.scene.background = new THREE.Color(0xA3A3A3);
    //self.scene.fog = new THREE.FogExp2(0xA3A3A3, 0.2);
    //gui control
    // const gui = new dat.GUI();
    // gui.add(self.scene.fog, 'near', 1, 2);
    // gui.add(self.scene.fog, 'far', 1, 2);
    //gui.add(self.scene.fog, 'z', -5, 20);

    // setup the camera
    self.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    self.camera.position.set(0,2,20);
    self.camera.lookAt(0,0,0);

    // Add a directional light to show off the objects
    const light = new THREE.DirectionalLight( 0xffffff, 1.5);
    // Position the light out from the scene, pointing at the origin
    light.position.set(0,2,20);
    light.lookAt(0,0,0);

    // add the light to the camera and the camera to the scene
    self.camera.add(light);
    self.scene.add(self.camera);

    // create the renderer
    self.renderer = new THREE.WebGLRenderer();

    var controls = new THREE.OrbitControls( self.camera, self.renderer.domElement );
    controls.update();

    // set the size and append it to the document
    self.renderer.setSize( width, height );
    document.getElementById(options.container).appendChild( self.renderer.domElement );


    // expose the public functions
    // Try on the console App.scene and you should see these 
    // three functions. Every other element acts as a private
    // attribute or function. For more information, check
    // javascript module patterns.
    self.public = {

        resize: function() {

        },

        addObject: function(obj) {
            self.scene.add( obj );
        },

        render: function() {
            requestAnimationFrame( self.public.render );
            controls.update();
            self.renderer.render( self.scene, self.camera );
        }

    };

    return self.public;
};