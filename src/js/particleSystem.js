/* author: Andrew Burks */
"use strict";

/* Get or create the application global variable */
var App = App || {};


var clock = new THREE.Clock();
var keyboard = new KeyboardState();
var plane;

const ParticleSystem = function() {

    // setup the pointer to the scope 'this' variable
    const self = this;

    // data container
    self.data = [];

    // scene graph group for the particle system
    const sceneObject = new THREE.Group();

    // bounds of the data
    const bounds = {};

    // create the containment box.
    // This cylinder is only to guide development.
    // TODO: Remove after the data has been rendered
    self.drawContainment = function() {

        // get the radius and height based on the data bounds
        const radius = (bounds.maxX - bounds.minX)/2.0 + 1;
        const height = (bounds.maxY - bounds.minY) + 1;

        // create a cylinder to contain the particle system
        const geometry = new THREE.CylinderGeometry( radius, radius, height, 32 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: true} );
        const cylinder = new THREE.Mesh( geometry, material );

        // add the containment to the scene
        sceneObject.add(cylinder);
    };

    // creates the particle system
    self.createParticleSystem = function() {

        // use self.data to create the particle system
        // draw your particle system here!
        //creating particle geometry
        var particleGeometry = new THREE.Geometry();
        //console.log(self.data.length);

        //creating particle material which is PointsMaterial
        //two arg - color, size of the particle
        var particleMaterial = new THREE.PointsMaterial({
            color: 'rgb(25s, 255, 255)', 
            size: 1,
            side: THREE.DoubleSide,
            sizeAttenuation: false,
            vertexColors: THREE.VertexColors,
        });        

        self.data.forEach(p => {
            const vector = new THREE.Vector3(p.X, p.Y, p.Z);
            particleGeometry.vertices.push(vector);
            if(p.concentration == 0)
            {
                particleGeometry.colors.push(new THREE.Color(0xffffd4));
            }
            else if(p.concentration > 0 && p.concentration <= 2)
            {
                particleGeometry.colors.push(new THREE.Color(0xfee391));
            }
            else if(p.concentration > 2 && p.concentration <= 5)
            {
                particleGeometry.colors.push(new THREE.Color(0xfec44f));
            }
            else if(p.concentration > 5 && p.concentration <= 10)
            {
                particleGeometry.colors.push(new THREE.Color(0xfe9929));
            }
            else if(p.concentration > 10 && p.concentration <= 20)
            {
                particleGeometry.colors.push(new THREE.Color(0xec7014));
            }
            else if(p.concentration > 20 && p.concentration <= 100)
            {
                particleGeometry.colors.push(new THREE.Color(0xcc4c02));
            }
            else{
                particleGeometry.colors.push(new THREE.Color(0x8c2d04));
            }
        });
        
        //create the particle system
        var particleSystem = new THREE.Points(
            particleGeometry,
            particleMaterial
        )

        sceneObject.add(particleSystem);


        // get the radius and height based on the data bounds
        const radius = (bounds.maxX - bounds.minX)/2.0 + 1;
        const height = (bounds.maxY - bounds.minY) + 1;

        var planeGeometry = new THREE.PlaneGeometry( 2 * radius , 1.25 * height);
        var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.geometry.translate(0, (bounds.maxY - bounds.minY)/2, 0);      
        
        sceneObject.add(plane);
        //animate();

        //for plane moving        
        Planeanimate();
        
        
    };

    // data loading function
    self.loadData = function(file){

        // read the csv file
        d3.csv(file)
        // iterate over the rows of the csv file
            .row(function(d) {

                // get the min bounds
                bounds.minX = Math.min(bounds.minX || Infinity, d.Points0);
                bounds.minY = Math.min(bounds.minY || Infinity, d.Points1);
                bounds.minZ = Math.min(bounds.minZ || Infinity, d.Points2);

                // get the max bounds
                bounds.maxX = Math.max(bounds.maxX || -Infinity, d.Points0);
                bounds.maxY = Math.max(bounds.maxY || -Infinity, d.Points1);
                bounds.maxZ = Math.max(bounds.maxY || -Infinity, d.Points2);

                // add the element to the data collection
                self.data.push({
                    // concentration density
                    concentration: Number(d.concentration),
                    // Position
                    X: Number(d.Points0),
                    Y: Number(d.Points2),
                    Z: Number(d.Points1),
                    // Velocity
                    U: Number(d.velocity0),
                    V: Number(d.velocity2),
                    W: Number(d.velocity1)
                });
            })
            // when done loading
            .get(function() {
                // draw the containment cylinder
                // TODO: Remove after the data has been rendered
               // self.drawContainment();

                // create the particle system
                self.createParticleSystem();
            });
    };

    // publicly available functions
    self.public = {

        // load the data and setup the system
        initialize: function(file){
            self.loadData(file);
        },

        // accessor for the particle system
        getParticleSystems : function() {
            return sceneObject;
        }
    };

    return self.public;

};

function Planeanimate(){
    requestAnimationFrame(Planeanimate);
    //self.render();
    updatePlane();
}

function updatePlane(){
    keyboard.update();
    var moveDistance = clock.getDelta();
    //console.log(moveDistance);

    if(keyboard.pressed("A")){
        plane.translateZ(-moveDistance);
    }
    if(keyboard.pressed("D")){
        plane.translateZ(moveDistance);

    }
}

