  // Custom Toast Notification System
        function triggerToast(message) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<i class="fas fa-sparkles text-aura-gold"></i> ${message}`;
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        function handleNewsletter(e) {
            e.preventDefault();
            triggerToast('Thank you for subscribing! ✨ Check your inbox for your 15% off code.');
            e.target.reset();
        }

        // Show/hide back-to-top button on scroll
        window.addEventListener('scroll', function() {
            const btn = document.getElementById('backToTop');
            if (window.scrollY > 400) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        /* THREE.JS 3D ROTATING DISPLAY IN BACKGROUND */
        window.onload = function() {
            const container = document.getElementById('bg-canvas-container');
            
            // Scene, Camera, Renderer
            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0xc9858c, 0.035);

            const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 3.5, 9);
            camera.lookAt(0, 0.5, 0);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;
            container.appendChild(renderer.domElement);

            // Lighting Setup
            const ambientLight = new THREE.AmbientLight(0xffe8e5, 1.05);
            scene.add(ambientLight);

            const mainSpot = new THREE.SpotLight(0xffd5c8, 4);
            mainSpot.position.set(5, 12, 6);
            mainSpot.angle = Math.PI / 4;
            mainSpot.penumbra = 0.8;
            mainSpot.castShadow = true;
            mainSpot.shadow.mapSize.width = 2048;
            mainSpot.shadow.mapSize.height = 2048;
            scene.add(mainSpot);

            const rimLight = new THREE.DirectionalLight(0xff9e80, 2.5);
            rimLight.position.set(-6, 8, -5);
            scene.add(rimLight);

            const pedestalGlow = new THREE.PointLight(0xc88a65, 3, 6);
            pedestalGlow.position.set(0, 0.6, 0);
            scene.add(pedestalGlow);

            // Rotational Parent Group for Pedestal Trio
            const displayGroup = new THREE.Group();
            scene.add(displayGroup);

            // 1. MARBLE PEDESTAL
            const pedestalGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.6, 64);
            
            // Procedural marble-like canvas texture
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#F5D5C6';
            ctx.fillRect(0, 0, 1024, 1024);
            ctx.strokeStyle = 'rgba(166, 99, 60, 0.2)';
            ctx.lineWidth = 4;
            for (let i = 0; i < 25; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
                ctx.bezierCurveTo(
                    Math.random() * 1024, Math.random() * 1024,
                    Math.random() * 1024, Math.random() * 1024,
                    Math.random() * 1024, Math.random() * 1024
                );
                ctx.stroke();
            }
            const marbleTexture = new THREE.CanvasTexture(canvas);

            const marbleMat = new THREE.MeshStandardMaterial({
                map: marbleTexture,
                roughness: 0.15,
                metalness: 0.1,
            });
            const pedestal = new THREE.Mesh(pedestalGeo, marbleMat);
            pedestal.position.y = -0.3;
            pedestal.receiveShadow = true;
            displayGroup.add(pedestal);

            // Illuminated Gold Ring Edge
            const ringGeo = new THREE.TorusGeometry(2.82, 0.04, 16, 100);
            const goldMat = new THREE.MeshStandardMaterial({
                color: 0xd5a36d,
                metalness: 0.94,
                roughness: 0.16,
                emissive: 0x65411e,
                emissiveIntensity: 0.24
            });

            function addProductLabel(parent, title, subtitle, width, height, position) {
                const labelCanvas = document.createElement('canvas');
                labelCanvas.width = 512;
                labelCanvas.height = 512;
                const labelContext = labelCanvas.getContext('2d');
                labelContext.fillStyle = 'rgba(250, 242, 239, 0.94)';
                labelContext.fillRect(24, 24, 464, 464);
                labelContext.strokeStyle = '#C88A65';
                labelContext.lineWidth = 7;
                labelContext.strokeRect(36, 36, 440, 440);
                labelContext.strokeStyle = 'rgba(200, 138, 101, 0.48)';
                labelContext.lineWidth = 2;
                labelContext.strokeRect(48, 48, 416, 416);
                labelContext.textAlign = 'center';
                labelContext.fillStyle = '#A6633C';
                labelContext.font = '42px Georgia';
                labelContext.fillText('GLOWAURA', 256, 174);
                labelContext.fillStyle = '#C88A65';
                labelContext.font = 'bold 20px Arial';
                labelContext.fillText(title.toUpperCase(), 256, 256);
                labelContext.fillStyle = '#76564a';
                labelContext.font = '15px Arial';
                labelContext.fillText(subtitle.toUpperCase(), 256, 302);
                labelContext.fillStyle = '#D85C82';
                labelContext.beginPath();
                labelContext.arc(256, 354, 5, 0, Math.PI * 2);
                labelContext.fill();

                const labelTexture = new THREE.CanvasTexture(labelCanvas);
                labelTexture.encoding = THREE.sRGBEncoding;
                const label = new THREE.Mesh(
                    new THREE.PlaneGeometry(width, height),
                    new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true, depthWrite: false })
                );
                label.position.set(position.x, position.y, position.z);
                parent.add(label);
            }
            const goldRing = new THREE.Mesh(ringGeo, goldMat);
            goldRing.rotation.x = Math.PI / 2;
            goldRing.position.y = 0.01;
            displayGroup.add(goldRing);

            // PRODUCT 1: Glass Rose Silk Serum (Center Left)
            const serumGroup = new THREE.Group();
            serumGroup.position.set(-1.1, 0.1, 0.4);

            const bottleGeo = new THREE.CylinderGeometry(0.4, 0.42, 1.4, 32);
            const glassMat = new THREE.MeshPhysicalMaterial({
                color: 0xf7c1ca,
                transmission: 0.85,
                opacity: 1,
                transparent: true,
                roughness: 0.1,
                ior: 1.52,
                reflectivity: 0.9
            });
            const serumBottle = new THREE.Mesh(bottleGeo, glassMat);
            serumBottle.position.y = 0.7;
            serumBottle.castShadow = true;
            serumGroup.add(serumBottle);
            addProductLabel(serumGroup, 'Radiance Serum', 'Hydrate · Repair · Glow', 0.62, 0.64, { x: 0, y: 0.73, z: 0.405 });

            // Gold Cap & Dropper
            const capGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.4, 32);
            const cap = new THREE.Mesh(capGeo, goldMat);
            cap.position.y = 1.5;
            serumGroup.add(cap);

            const bulbGeo = new THREE.SphereGeometry(0.18, 16, 16);
            const bulbMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
            const bulb = new THREE.Mesh(bulbGeo, bulbMat);
            bulb.position.y = 1.75;
            serumGroup.add(bulb);

            displayGroup.add(serumGroup);

            // PRODUCT 2: Gold Embellished Cream Jar (Center Right)
            const jarGroup = new THREE.Group();
            jarGroup.position.set(1.2, 0.1, -0.2);

            const jarGeo = new THREE.CylinderGeometry(0.55, 0.5, 0.8, 32);
            const jarMat = new THREE.MeshStandardMaterial({
                color: 0xfde2e4,
                roughness: 0.3,
                metalness: 0.4
            });
            const jar = new THREE.Mesh(jarGeo, jarMat);
            jar.position.y = 0.4;
            jar.castShadow = true;
            jarGroup.add(jar);
            addProductLabel(jarGroup, 'Rose Cream', 'Velvet Moisturizer', 0.67, 0.45, { x: 0, y: 0.4, z: 0.525 });

            const jarCapGeo = new THREE.CylinderGeometry(0.57, 0.57, 0.25, 32);
            const jarCap = new THREE.Mesh(jarCapGeo, goldMat);
            jarCap.position.y = 0.9;
            jarCap.castShadow = true;
            jarGroup.add(jarCap);

            displayGroup.add(jarGroup);

            // PRODUCT 3: Luxury Elixir Tall Dropper Bottle (Back Center)
            const elixirGroup = new THREE.Group();
            elixirGroup.position.set(0, 0.1, -1.1);

            const elixirGeo = new THREE.CylinderGeometry(0.35, 0.38, 1.8, 32);
            const elixirMat = new THREE.MeshPhysicalMaterial({
                color: 0xf5d5c6,
                transmission: 0.75,
                transparent: true,
                roughness: 0.05,
                ior: 1.48
            });
            const elixirBottle = new THREE.Mesh(elixirGeo, elixirMat);
            elixirBottle.position.y = 0.9;
            elixirBottle.castShadow = true;
            elixirGroup.add(elixirBottle);
            addProductLabel(elixirGroup, 'Golden Elixir', 'Nourishing Face Oil', 0.52, 0.66, { x: 0, y: 0.92, z: 0.36 });

            const elixirCap = new THREE.Mesh(capGeo, goldMat);
            elixirCap.position.y = 1.9;
            elixirGroup.add(elixirCap);

            displayGroup.add(elixirGroup);

            // Responsive Window Resize Listener
            window.addEventListener('resize', onWindowResize, false);
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            // Subtle Mouse Interactive Tilt
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
                mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
            });

            // Continuous Animation Loop
            function animate() {
                requestAnimationFrame(animate);

                // Gentle Continuous pedestal rotation
                displayGroup.rotation.y += 0.0018;

                // Subtle floating animation for products
                const time = Date.now() * 0.0015;
                serumGroup.position.y = 0.1 + Math.sin(time) * 0.04;
                jarGroup.position.y = 0.1 + Math.sin(time + 1) * 0.03;
                elixirGroup.position.y = 0.1 + Math.sin(time + 2) * 0.04;

                // Parallax camera easing
                camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
                camera.position.y += (3.5 - mouseY * 2 - camera.position.y) * 0.03;
                camera.lookAt(0, 0.5, 0);

                renderer.render(scene, camera);
            }

            animate();
        };