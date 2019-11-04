/* author: Andrew Burks */
"use strict";

/* Get or create the application global variable */
var App = App || {};

const ParticleSystem = function() {
    //making public to call from anywhere
    var plane, particleSystem, velocitySystem;
    //using this for not calling plane when showing velocity
    var velocityTest = false;

    // setup the pointer to the scope 'this' variable
    const self = this;

    // data container
    self.data = [];

    // scene graph group for the particle system
    const sceneObject = new THREE.Group();

    // //gui control
    // const gui = new dat.GUI();
    // gui.add(sceneObject.position, 'x', -10, 10);
    // gui.add(sceneObject.position, 'y', -10, 10);
    // gui.add(sceneObject.position, 'z', -5, 20);

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

        sceneObject.position.x = 0;
        sceneObject.position.y = -2;
        sceneObject.position.z = 0;

        // use self.data to create the particle system
        // draw your particle system here!
        //creating particle geometry
        var particleGeometry = new THREE.Geometry();
        //console.log(self.data.length);

        //creating particle material which is PointsMaterial
        //two arg - color, size of the particle
        var particleMaterial = new THREE.PointsMaterial({
            color: 'rgb(255, 255, 255)', 
            size: 1,
            side: THREE.DoubleSide,
            sizeAttenuation: false,
            vertexColors: THREE.VertexColors,
        });
        //var c1 = 0; 
        //var c2 = 0;
        //var c3 = 0;
       // var c4= 0;
        //var c5 = 0;

        self.data.forEach(p => {
            const vector = new THREE.Vector3(p.X, p.Y, p.Z);
            particleGeometry.vertices.push(vector);
            if(p.concentration >= 0 && p.concentration <=0.09)
            {
                particleGeometry.colors.push(new THREE.Color(0xd7191c));
                //c1++;
            }
            else if(p.concentration >= 0.09 && p.concentration <= 0.5)
            {
                particleGeometry.colors.push(new THREE.Color(0x2c7bb6));
                //c2++;
                
            }
            else if(p.concentration > 0.5 && p.concentration <= 20)
            {
                particleGeometry.colors.push(new THREE.Color(0xffffbf));
                //c3++;
            }
            else if(p.concentration > 20 && p.concentration <= 40)
            {
                particleGeometry.colors.push(new THREE.Color(0xabd9e9));
                //c4++;
            }
            else{
                particleGeometry.colors.push(new THREE.Color(0xfdae61));
                //c5++;
            }
        });
               
        //create the particle system
        particleSystem = new THREE.Points(
            particleGeometry,
            particleMaterial
        )

        // const gui = new dat.GUI();
        // gui.add(sceneObject.position, 'x', 0, 10);
        // gui.add(sceneObject.position, 'y', 0, 10);
        // gui.add(sceneObject.position, 'z', 15, 30);

        //naming the object to call from any where
        particleSystem.name = 'particleSystem'

        sceneObject.add(particleSystem);
        
        
    };

    self.createPlane = function() {
        
        // get the radius and height based on the data bounds
        const radius = (bounds.maxX - bounds.minX)/2.0 + 1;
        const height = (bounds.maxY - bounds.minY) + 1;

        var planeGeometry = new THREE.PlaneGeometry( 2 * radius , 1.25 * height);
        var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xD3D3D3, side: THREE.DoubleSide} );
        plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.geometry.translate(0, (bounds.maxY - bounds.minY)/2, 0);   
        
        //keyboard work
       var value = 0.025;
       document.addEventListener("keydown", onDocumentKeyDown, false);
       function onDocumentKeyDown(event) {            
            var keyCode = event.which;
            if (keyCode == 65) {
                //console.log(plane.position.z);
                plane.translateZ(-value);
                //var zAxis = plane.position.z;
                self.scatterPlot(plane.position.z);
                //sceneObject.add(scatterPlotObject);
                self.greyScale(plane.position.z);
            }
            else if (keyCode == 68)
            {
                //console.log(plane.position.z);
                plane.translateZ(value);
                self.scatterPlot(plane.position.z);
                self.greyScale(plane.position.z);
            }
            
    }   
    plane.name = 'plane'
        
        sceneObject.add(plane);
 }
 self.scatterPlot = function(zAxis){
     if(velocityTest == false){
        d3.select('#rowSVG').select('svg').remove();
        //zAxis = zAxis.toFixed(6);
        //console.log(zAxis);
        //console.log(self.data.length);
        var filteredData = self.data.filter(p => {
            return p.Z >= (zAxis - 0.102) && p.Z <= (zAxis + 0.102);  
        });
        //console.log(filteredData);
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
        // append the svg object to the body of the page
        var svg = d3.select("#rowSVG")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                //.style("background-color", 'white')
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
    
        // Add X axis
        var xScale = d3.scaleLinear()
             .domain(d3.extent(filteredData.map(p => p.X)))
                  .range([ 0, width ]);
        svg.append("g")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(xScale));
    
        // Add Y axis
        var yScale = d3.scaleLinear()
             .domain(d3.extent(filteredData.map(p => p.Y)))
             .range([ height, 0]);
        svg.append("g")
           .call(d3.axisLeft(yScale));
        

        var colors = d3.scaleLinear()
                        .domain([0, 0.09, 0.5, 20, 40, 357.19])
                       .range([ "#D7191C", "#2C7BB6", "#FFFFBF","#ABD9E9", "#FDAE61"]);
                        //.range(["#FDAE61", "#2C7BB6", "#D7191C"]);
    
        // Add dots
        var circles = svg.append('g')
            .selectAll("dots")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.X); } )
            .attr("cy", function (d) { return yScale(d.Y); } )
            .style("fill", function(d){ return colors(d.concentration)})
            .attr("r", 3);
                 
        }

 }
 self.greyScale = function(zAxis){
    //console.log(particleSystem.geometry.vertices[10]);
    for (var i = 0 ; i < particleSystem.geometry.vertices.length; i++){
        var concentration = self.data[i].concentration;
        //console.log(concentration);
        if(particleSystem.geometry.vertices[i].z >= (zAxis - 0.102) && particleSystem.geometry.vertices[i].z <= (zAxis + 0.102)){
            //console.log('if condition ');
            if(concentration >= 0 && concentration <=0.09)
            {
                particleSystem.geometry.colors[i].set("#D7191C");
            }
            else if(concentration >= 0.09 && concentration <= 0.5)
            {
                particleSystem.geometry.colors[i].set("#2C7BB6");
                
            }
            else if(concentration > 0.5 && concentration <= 20)
            {
                particleSystem.geometry.colors[i].set("#FFFFBF");
               
            }
            else if(concentration > 20 && concentration <= 40)
            {
                particleSystem.geometry.colors[i].set("#ABD9E9");
                
            }
            else{
                particleSystem.geometry.colors[i].set("#FDAE61");
               
            }
    }else{
        particleSystem.geometry.colors[i].set("#FFFFFF");
    }
    }
    particleSystem.geometry.colorsNeedUpdate=true;
    };

//velocity function
 self.createVelocity = function() {

    // sceneObject.position.x = 0;
    sceneObject.position.y = 2;
    // sceneObject.position.z = 5;

    // use self.data to create the particle system
    // draw your particle system here!
    //creating particle geometry
    var velocityGeometry = new THREE.Geometry();
    //console.log(self.data.length);

    //velocityGeometry.lookAt(-20,-20,-20);

    //creating particle material which is PointsMaterial
    //two arg - color, size of the particle
    var velocityMaterial = new THREE.PointsMaterial({
        color: 'rgb(255, 255, 255)', 
        size: 1,
        side: THREE.DoubleSide,
        sizeAttenuation: false,
        vertexColors: THREE.VertexColors,
    });        

    self.data.forEach(p => {
        const vector = new THREE.Vector3(p.U, p.V, p.W);
        velocityGeometry.vertices.push(vector);
        if(p.concentration >= 0 && p.concentration <=0.09)
        {
            velocityGeometry.colors.push(new THREE.Color(0xd7191c));
            //c1++;
        }
        else if(p.concentration >= 0.09 && p.concentration <= 0.5)
        {
            velocityGeometry.colors.push(new THREE.Color(0x2c7bb6));
            //c2++;
            
        }
        else if(p.concentration > 0.5 && p.concentration <= 20)
        {
            velocityGeometry.colors.push(new THREE.Color(0xffffbf));
            //c3++;
        }
        else if(p.concentration > 20 && p.concentration <= 40)
        {
            velocityGeometry.colors.push(new THREE.Color(0xabd9e9));
            //c4++;
        }
        else{
            velocityGeometry.colors.push(new THREE.Color(0xfdae61));
            //c5++;
        }
    });
    
    //create the particle system
    velocitySystem = new THREE.Points(
        velocityGeometry,
        velocityMaterial
    )
    //velocitySystem.name = 'velocitySystem'
    velocitySystem.name = 'velocitySystem'
    sceneObject.add(velocitySystem);
    
    
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
                self.createPlane();
                //self.legend();
                d3.select('#scatter').on('click', function(){
                    //d3.select('#scene').select('canvas').remove();
                    //console.log(sceneObject.getObjectByName('particleSystem'));
                    d3.select('#rowSVG').select('svg').remove();
                    velocityTest = true;
                    var particleName = sceneObject.getObjectByName('particleSystem');
                    sceneObject.remove(particleName);
                    var planeName = sceneObject.getObjectByName('plane');
                    sceneObject.remove(planeName);
                    self.createVelocity();
                    //self.drawContainment();
                    //self.createPlane();
                });
                d3.select('#reset').on('click', function(){
                    velocityTest = false;
                    var velocityName = sceneObject.getObjectByName('velocitySystem');
                    sceneObject.remove(velocityName);
                    var planeName = sceneObject.getObjectByName('plane');
                    sceneObject.remove(planeName);
                    self.createParticleSystem();
                    self.createPlane();
                });
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

