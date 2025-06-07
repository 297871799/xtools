// 粒子系统配置和实现
document.addEventListener('DOMContentLoaded', function() {
    // 获取CSS变量
    const getThemeColor = (variable) => {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    };
    
    // 解析CSS颜色为十六进制
    const parseColor = (cssColor) => {
        // 简单解析十六进制颜色，如 #0066ff
        if (cssColor.startsWith('#')) {
            return parseInt(cssColor.substring(1), 16);
        }
        // 解析 rgb 颜色，如 rgb(0, 102, 255)
        else if (cssColor.startsWith('rgb')) {
            const values = cssColor.match(/\d+/g);
            if (values && values.length >= 3) {
                return (parseInt(values[0]) << 16) + (parseInt(values[1]) << 8) + parseInt(values[2]);
            }
        }
        
        // 默认颜色
        return 0x0066ff;
    };
    
    // 获取主题的强调色
    const accentColor = getThemeColor('--accent-color');
    const parsedColor = parseColor(accentColor);
    
    // Three.js 场景设置
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });
    
    // 设置渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('hero-bg').appendChild(renderer.domElement);
    
    // 创建粒子几何体
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const positions = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);
    
    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        scales[i] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    
    // 创建着色器材质
    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            size: { value: 15.0 },
            color: { value: new THREE.Color(parsedColor) }
        },
        vertexShader: `
            attribute float scale;
            uniform float time;
            uniform float size;
            
            void main() {
                vec3 pos = position;
                pos.y += sin(time * 0.2 + position.x) * 0.1;
                pos.x += cos(time * 0.2 + position.y) * 0.1;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * scale * (1.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            
            void main() {
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 3.0);
                
                vec3 finalColor = mix(vec3(0.0), color, strength);
                gl_FragColor = vec4(finalColor, strength);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    // 创建粒子系统
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // 设置相机位置
    camera.position.z = 3;
    
    // 鼠标移动效果
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.00005;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.00005;
    });
    
    // 监听主题变化
    const updateParticleColor = () => {
        const newAccentColor = getThemeColor('--accent-color');
        const newParsedColor = parseColor(newAccentColor);
        particlesMaterial.uniforms.color.value.set(newParsedColor);
    };
    
    // 创建一个MutationObserver来监听data-theme属性变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                updateParticleColor();
            }
        });
    });
    
    // 开始观察document元素的data-theme属性变化
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    // 动画循环
    const clock = new THREE.Clock();
    
    const animate = () => {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        // 平滑的相机移动
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.05;
        particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.05;
        
        // 更新着色器时间
        particlesMaterial.uniforms.time.value = elapsedTime;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}); 