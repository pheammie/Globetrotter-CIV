document.addEventListener('DOMContentLoaded', function() {
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 200;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(500, 500);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('globeViz').appendChild(renderer.domElement);

    // Create globe
    const sphereGeometry = new THREE.SphereGeometry(100, 64, 64);
    
    // Load earth texture with continents
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 0.2
    });
    
    const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
    scene.add(earth);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(200, 200, 200);
    scene.add(pointLight);

    // Add markers for regions
    const markerPositions = [
        { lat: 8.7832, lng: 34.5085, name: 'Africa' },
        { lat: 34.0479, lng: 100.6197, name: 'Asia' },
        { lat: 54.5260, lng: 15.2551, name: 'Europe' },
        { lat: 37.0902, lng: -95.7129, name: 'North America' },
        { lat: -8.7832, lng: -55.4915, name: 'South America' },
        { lat: -25.2744, lng: 133.7751, name: 'Oceania' }
    ];

    // Convert lat/lng to 3D positions and add markers
    markerPositions.forEach(pos => {
        const marker = createMarker();
        const position = latLngToVector3(pos.lat, pos.lng, 102);
        marker.position.set(position.x, position.y, position.z);
        scene.add(marker);
    });

    // Helper function to create markers
    function createMarker() {
        const markerGeometry = new THREE.SphereGeometry(2, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        return new THREE.Mesh(markerGeometry, markerMaterial);
    }

    // Helper function to convert lat/lng to 3D position
    function latLngToVector3(lat, lng, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);

        return new THREE.Vector3(
            -radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    // Add click handlers for region buttons
    document.querySelectorAll('.regions-list div').forEach((button, index) => {
        button.addEventListener('click', () => {
            const position = markerPositions[index];
            rotateToLatLng(position.lat, position.lng);
        });
    });

    // Function to rotate globe to specific lat/lng
    function rotateToLatLng(lat, lng) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        earth.rotation.y = theta;
        earth.rotation.x = phi - Math.PI/2;
    }

    // Animation
    let lastTime = 0;
    const rotationSpeed = 0.0002; // Adjust this value to change rotation speed

    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Rotate the earth
        earth.rotation.y += rotationSpeed * deltaTime;
        
        renderer.render(scene, camera);
    }

    // Handle window resize
    function onWindowResize() {
        const container = document.querySelector('.globe-container');
        const size = Math.min(container.offsetWidth, container.offsetHeight);
        
        renderer.setSize(size, size);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate(0);

    // Handle contact form submission
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Here you would typically send the data to your server
        alert('Thank you for your message! We will get back to you soon.');
        
        // Clear the form
        this.reset();
    });

    // Handle smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});