/* author: Andrew Burks */
"use strict";

/* Get or create the application global variable */
var App = App || {};

const ParticleSystem = function() {

    var clock = new THREE.Clock();
    var keyboard = new KeyboardState();
    var plane;

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
            color: 'rgb(255, 255, 255)', 
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
        
        
    };

    self.createPlane = function() {
        
        // get the radius and height based on the data bounds
        const radius = (bounds.maxX - bounds.minX)/2.0 + 1;
        const height = (bounds.maxY - bounds.minY) + 1;

        var planeGeometry = new THREE.PlaneGeometry( 2 * radius , 1.25 * height);
        var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.geometry.translate(0, (bounds.maxY - bounds.minY)/2, 0);   
        
        //keyboard work
       var value = 0.025;
       document.addEventListener("keydown", onDocumentKeyDown, false);
       function onDocumentKeyDown(event) {            
            var keyCode = event.which;
            if (keyCode == 65) {
                console.log(plane.position.z);
                plane.translateZ(-value);
                //var zAxis = plane.position.z;
                self.scatterPlot(plane.position.z);
            }
            else if (keyCode == 68)
            {
                console.log(plane.position.z);
                plane.translateZ(value);
                self.scatterPlot(plane.position.z);
            }
            
    }   
        
        sceneObject.add(plane);
 }
 self.scatterPlot = function(zAxis){
    d3.select('#rowSVG').select('svg').remove();
    //zAxis = zAxis.toFixed(6);
    console.log(zAxis);
    console.log(self.data.length);
    var filteredData = self.data.filter(p => {
    return p.Z >= (zAxis - 0.0025) && p.Z <= (zAxis + 0.0025);  
    });
    console.log(filteredData);
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#rowSVG")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.X); } )
        .attr("cy", function (d) { return yScale(d.Y); } )
        .attr("r", 2);
 }



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

