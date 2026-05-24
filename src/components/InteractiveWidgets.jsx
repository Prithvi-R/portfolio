import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. AUTONOMOUS CAR PATHFINDER & LIDAR (Canvas)
// ==========================================
export const AutonomousCarSimulator = () => {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(2);
  const [obstacles, setObstacles] = useState([
    { x: 180, y: 150, r: 25 },
    { x: 420, y: 220, r: 30 },
    { x: 300, y: 90, r: 20 },
  ]);
  const [isDriving, setIsDriving] = useState(true);

  // Track coordinates for path (oval loop)
  const getTrackPoint = (t) => {
    // Width: 600, Height: 300. Center: 300, 150
    const rx = 220;
    const ry = 100;
    const x = 300 + rx * Math.cos(t);
    const y = 150 + ry * Math.sin(t);
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let t = 0; // parameter for path positioning
    
    // Car position and heading
    let carX = 300;
    let carY = 250;
    let carAngle = 0;
    
    const lidarRays = 7;
    const maxLidarDist = 120;
    const lidarAngleSpan = Math.PI / 2.5; // ~72 degrees front span

    const drawSimulation = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Draw grid background
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw race track boundaries (outer and inner loops)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 40;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const pt = getTrackPoint(angle);
        if (angle === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.stroke();

      // Track centerline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 10]);
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const pt = getTrackPoint(angle);
        if (angle === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 3. Draw obstacles
      obstacles.forEach((obs) => {
        // Outer hazard ring (flat, subtle)
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.r + 10, 0, Math.PI * 2);
        ctx.stroke();

        // Core obstacle
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 4. Update F1 Car simulation physics (Pure pursuit to track + Obstacle Avoidance)
      if (isDriving) {
        t += (speed * 0.005);
        if (t > Math.PI * 2) t -= Math.PI * 2;

        const target = getTrackPoint(t + 0.1); // Lookahead point
        
        // Steering logic: steer towards track lookahead point
        let steerX = target.x - carX;
        let steerY = target.y - carY;
        
        // Avoidance steering (Lidar influence)
        obstacles.forEach((obs) => {
          const dx = carX - obs.x;
          const dy = carY - obs.y;
          const dist = Math.hypot(dx, dy);
          const minSafetyDist = obs.r + 45;
          if (dist < minSafetyDist) {
            // Push steering away from obstacle
            const force = (minSafetyDist - dist) / minSafetyDist;
            steerX += (dx / dist) * force * 150;
            steerY += (dy / dist) * force * 150;
          }
        });

        // Set car heading
        const desiredAngle = Math.atan2(steerY, steerX);
        
        // Smooth turning
        let angleDiff = desiredAngle - carAngle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        carAngle += angleDiff * 0.1;

        // Move car
        carX += Math.cos(carAngle) * speed;
        carY += Math.sin(carAngle) * speed;
      }

      // 5. Compute and Draw Lidar Sensors
      const startAngle = carAngle - lidarAngleSpan / 2;
      const angleStep = lidarAngleSpan / (lidarRays - 1);
      
      let detectedPoints = [];

      for (let i = 0; i < lidarRays; i++) {
        const rayAngle = startAngle + i * angleStep;
        const rx = Math.cos(rayAngle);
        const ry = Math.sin(rayAngle);
        
        let rayEnd = { x: carX + rx * maxLidarDist, y: carY + ry * maxLidarDist };
        let hitDist = maxLidarDist;

        // Check intersection with screen boundary
        const checkWallIntersect = (tx, ty, r) => {
          // Check collision with circular obstacles
          obstacles.forEach((obs) => {
            // Quadratic equation for ray-circle intersect
            // Ray: P = Car + d * R
            const cx = carX - obs.x;
            const cy = carY - obs.y;
            const a = rx*rx + ry*ry;
            const b = 2 * (cx*rx + cy*ry);
            const c = cx*cx + cy*cy - obs.r*obs.r;
            const desc = b*b - 4*a*c;
            if (desc >= 0) {
              const d1 = (-b - Math.sqrt(desc)) / (2*a);
              const d2 = (-b + Math.sqrt(desc)) / (2*a);
              if (d1 > 0 && d1 < hitDist) hitDist = d1;
              else if (d2 > 0 && d2 < hitDist) hitDist = d2;
            }
          });
        };

        checkWallIntersect();
        
        // Final ray hit point
        rayEnd = { x: carX + rx * hitDist, y: carY + ry * hitDist };
        detectedPoints.push(rayEnd);

        // Draw Lidar beam
        ctx.strokeStyle = hitDist < 60 ? 'rgba(239, 68, 68, 0.45)' : 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(carX, carY);
        ctx.lineTo(rayEnd.x, rayEnd.y);
        ctx.stroke();

        // Draw Lidar hit dot
        ctx.fillStyle = hitDist < 60 ? '#ef4444' : '#5c90b0';
        ctx.beginPath();
        ctx.arc(rayEnd.x, rayEnd.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw local SLAM map points (simulated point cloud overlay)
      ctx.strokeStyle = 'rgba(92, 144, 176, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      detectedPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // 7. Draw F1 Car
      ctx.save();
      ctx.translate(carX, carY);
      ctx.rotate(carAngle);
      
      // Chassis
      ctx.fillStyle = '#0a0b10';
      ctx.strokeStyle = '#5c90b0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // F1 Car shape outline
      ctx.moveTo(15, 0); // nose cone
      ctx.lineTo(5, -6);
      ctx.lineTo(-12, -7); // rear wing pod left
      ctx.lineTo(-15, -4);
      ctx.lineTo(-15, 4);
      ctx.lineTo(-12, 7);  // rear wing pod right
      ctx.lineTo(5, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front wing
      ctx.fillStyle = '#5c90b0';
      ctx.fillRect(8, -10, 3, 20);

      // Rear wing
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(-17, -11, 4, 22);
      ctx.strokeStyle = '#5c90b0';
      ctx.strokeRect(-17, -11, 4, 22);

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-10, -9, 5, 2); // rear left
      ctx.fillRect(-10, 7, 5, 2);  // rear right
      ctx.fillRect(3, -8, 4, 2);   // front left
      ctx.fillRect(3, 6, 4, 2);    // front right

      ctx.restore();

      // Loop animation
      animationId = requestAnimationFrame(drawSimulation);
    };

    drawSimulation();

    return () => cancelAnimationFrame(animationId);
  }, [speed, obstacles, isDriving]);

  // Click on canvas to drop obstacle
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Drop new obstacle
    const radius = 15 + Math.random() * 15;
    setObstacles((prev) => {
      // Keep only last 5 obstacles to avoid cluttering
      const updated = [...prev, { x, y, r: radius }];
      if (updated.length > 6) updated.shift();
      return updated;
    });
  };

  const clearObstacles = () => {
    setObstacles([]);
  };

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h4>ROS2 LiDAR & SLAM Pathfinder (Interactive)</h4>
        <span className="widget-tag">A2RL Autonomous Race Car</span>
      </div>
      <p className="widget-desc">
        Click inside the arena to drop new **static obstacles**. The F1 car will dynamically deploy repulsive potential forces in its local world model to plan collision-free paths using simulated LiDAR rays.
      </p>
      
      <div className="canvas-wrapper" style={{ position: 'relative', background: '#0a0d16', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', cursor: 'crosshair' }}>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300} 
          onClick={handleCanvasClick}
          style={{ display: 'block', width: '100%' }}
        />
        <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(10, 11, 16, 0.85)', padding: '5px 10px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          🏎️ VEHICLE SPEED: {(speed * 10).toFixed(0)} KM/H
        </div>
      </div>

      <div className="widget-controls" style={{ display: 'flex', gap: '15px', marginTop: '12px' }}>
        <button 
          onClick={() => setIsDriving(!isDriving)} 
          className="widget-btn" 
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          {isDriving ? 'Pause Simulation' : 'Resume Simulation'}
        </button>
        <button 
          onClick={clearObstacles} 
          className="widget-btn"
          style={{ borderColor: '#ef4444', color: '#ef4444' }}
        >
          Clear Obstacles
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Throttle:</span>
          <input 
            type="range" 
            min={1} 
            max={5} 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))} 
            style={{ width: '80px', accentColor: '#5c90b0' }} 
          />
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 2. AGENTIC SELF-CORRECTION RAG (Graph Flow)
// ==========================================
export const RAGGraphSimulator = () => {
  const [activeStep, setActiveStep] = useState(0); // 0: Idle, 1: Query, 2: Retrieve, 3: Generate, 4: Evaluate, 5: Correct/Loop, 6: Success Output
  const [queryType, setQueryType] = useState('simple'); // 'simple' or 'complex' (hallucination test)
  const [log, setLog] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const stepsInfo = [
    { title: "User Input", desc: "User prompt entered into system." },
    { title: "Retrieve Context", desc: "Similarity search vector storage (ChromaDB) to fetch reference data." },
    { title: "Generate Answer", desc: "AI Node (Gemini-Flash) forms answers combining context + prompt." },
    { title: "Self-Check Grader", desc: "Check: Are there hallucinations? Is retrieved data fully relevant?" },
    { title: "Self-Correction", desc: "AI Node rewrites search keywords and re-targets vectors." },
    { title: "Validated Output", desc: "Answer verified and returned with reliability score." }
  ];

  const logMessage = (msg) => {
    setLog((prev) => [msg, ...prev].slice(0, 10));
  };

  useEffect(() => {
    if (!isPlaying) return;
    let timer;

    const runSimulationStep = () => {
      setActiveStep((current) => {
        if (current === 0) {
          logMessage("🏁 Initiating Graph RAG Node pipeline.");
          logMessage(`Question Type: [${queryType.toUpperCase()}]. Routing query.`);
          return 1;
        } else if (current === 1) {
          logMessage("🔍 Node 1 [Retriever]: Searching vector index store...");
          return 2;
        } else if (current === 2) {
          logMessage("🧠 Node 2 [Generator]: Drafting answer via Gemini API.");
          return 3;
        } else if (current === 3) {
          logMessage("⚖️ Node 3 [Grader]: Executing verification constraints.");
          if (queryType === 'complex') {
            logMessage("⚠️ Grader Alert: Hallucination detected! Context relevance score: 0.38 (Required: >= 0.70)");
            return 4; // Move to correction loop
          } else {
            logMessage("✅ Grader Success: Answer validated against context! Relevance: 0.94");
            return 5; // Move to Success Output
          }
        } else if (current === 4) {
          logMessage("🔄 Node 4 [Corrector]: Rewriting query. Injecting correction vectors.");
          // Trigger transition back to retrieve (loop)
          timer = setTimeout(() => {
            logMessage("🔁 Graph Routing: Re-entering Retrieve Node with refined schema.");
            // Reset query type to simple so the second loop succeeds
            setQueryType('simple');
            setActiveStep(2);
          }, 1500);
          return 4;
        } else if (current === 5) {
          logMessage("🎯 Pipeline Complete: Delivering response with 94% relevance score.");
          setIsPlaying(false);
          return 6;
        } else {
          return 0;
        }
      });
    };

    timer = setTimeout(runSimulationStep, 1800);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep, queryType]);

  const startSimulation = (type) => {
    setLog([]);
    setQueryType(type);
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h4>Self-Correcting Graph RAG Pipeline (Agentic Node State)</h4>
        <span className="widget-tag" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>Agentic State Graph</span>
      </div>
      <p className="widget-desc">
        Select a query type. Watch the agent loop back and rewrite queries automatically if the **Grader node** registers high hallucination ratios.
      </p>

      {/* RAG Nodes Layout */}
      <div className="graph-nodes-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', position: 'relative', padding: '15px 10px', background: '#0a0d16', border: '1px solid var(--border-color)', borderRadius: '8px', minHeight: '190px' }}>
        
        {/* Node 1: User Input */}
        <div className={`graph-node ${activeStep === 1 ? 'node-active' : ''}`} style={{ borderColor: activeStep === 1 ? '#8a2be2' : 'rgba(255,255,255,0.1)' }}>
          <div className="node-num">N1</div>
          <h5>User Input</h5>
          <span className="node-status">{activeStep === 1 ? 'Routing...' : 'Idle'}</span>
        </div>

        {/* Node 2: Retrieve Context */}
        <div className={`graph-node ${activeStep === 2 ? 'node-active' : ''}`} style={{ borderColor: activeStep === 2 ? '#8a2be2' : 'rgba(255,255,255,0.1)' }}>
          <div className="node-num">N2</div>
          <h5>Vector Retriever</h5>
          <span className="node-status">{activeStep === 2 ? 'Searching...' : 'Idle'}</span>
        </div>

        {/* Node 3: LLM Generator */}
        <div className={`graph-node ${activeStep === 3 ? 'node-active' : ''}`} style={{ borderColor: activeStep === 3 ? '#8a2be2' : 'rgba(255,255,255,0.1)' }}>
          <div className="node-num">N3</div>
          <h5>LLM Generator</h5>
          <span className="node-status">{activeStep === 3 ? 'Drafting...' : 'Idle'}</span>
        </div>

        {/* Node 4: Grader */}
        <div className={`graph-node ${activeStep === 4 ? 'node-alert' : activeStep === 3 ? '' : ''}`} style={{ borderColor: activeStep === 4 ? '#ef4444' : 'rgba(255,255,255,0.1)' }}>
          <div className="node-num">N4</div>
          <h5>Grader (Self-Check)</h5>
          <span className="node-status" style={{ color: activeStep === 4 ? '#ef4444' : '' }}>{activeStep === 4 ? 'Looping Back!' : 'Idle'}</span>
        </div>

        {/* Node 5: Self-Correction */}
        <div className={`graph-node ${activeStep === 4 ? 'node-active' : ''}`} style={{ borderColor: activeStep === 4 ? '#8a2be2' : 'rgba(255,255,255,0.1)' }}>
          <div className="node-num">N5</div>
          <h5>Query Rewriter</h5>
          <span className="node-status">{activeStep === 4 ? 'Self-Correcting...' : 'Idle'}</span>
        </div>

        {/* Node 6: Output */}
        <div className={`graph-node ${activeStep === 6 ? 'node-success' : ''}`} style={{ borderColor: activeStep === 6 ? '#22c55e' : 'rgba(255,255,255,0.1)' }}>
          <div className="node-num">N6</div>
          <h5>Validated Output</h5>
          <span className="node-status" style={{ color: activeStep === 6 ? '#22c55e' : '' }}>{activeStep === 6 ? '94% Relevant!' : 'Idle'}</span>
        </div>

        {/* Connections Overlay (Concept SVG) */}
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
          Looping Back Enabled ↩️
        </div>
      </div>

      {/* Control Buttons */}
      <div className="widget-controls" style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button 
          disabled={isPlaying}
          onClick={() => startSimulation('simple')} 
          className="widget-btn" 
          style={{ borderColor: '#8a2be2', color: '#8a2be2', opacity: isPlaying ? 0.5 : 1 }}
        >
          Query: Simple Search
        </button>
        <button 
          disabled={isPlaying}
          onClick={() => startSimulation('complex')} 
          className="widget-btn" 
          style={{ borderColor: '#e11d48', color: '#e11d48', opacity: isPlaying ? 0.5 : 1 }}
        >
          Query: Hallucinated Search (Forces Loop)
        </button>
      </div>

      {/* Terminal Logs */}
      <div className="widget-terminal" style={{ background: '#07080e', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', height: '110px', overflowY: 'auto', marginTop: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
        <div style={{ color: '#64748b', borderBottom: '1px solid #1e293b', paddingBottom: '3px', marginBottom: '5px' }}>🖥️ RAG PIPELINE EXECUTION TELEMETRY logs:</div>
        {log.length === 0 && <span style={{ color: '#475569' }}>Await pipeline query trigger...</span>}
        {log.map((entry, idx) => (
          <div key={idx} style={{ color: entry.startsWith('⚠️') ? '#ef4444' : entry.startsWith('✅') || entry.startsWith('🎯') ? '#22c55e' : '#e2e8f0', margin: '2px 0' }}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};


// ==========================================
// 3. 2x2 SYSTOLIC ARRAY ACCELERATOR
// ==========================================
export const SystolicArraySimulator = () => {
  // Input matrices
  const [a00, setA00] = useState(2);
  const [a01, setA01] = useState(3);
  const [a10, setA10] = useState(1);
  const [a11, setA11] = useState(4);

  const [b00, setB00] = useState(1);
  const [b01, setB01] = useState(2);
  const [b10, setB10] = useState(3);
  const [b11, setB11] = useState(0);

  // Simulation states
  const [cycle, setCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // PE (Processing Elements) registers (Accumulators)
  const [pe00, setPe00] = useState(0);
  const [pe01, setPe01] = useState(0);
  const [pe10, setPe10] = useState(0);
  const [pe11, setPe11] = useState(0);

  // Wire signals flowing through array
  // Left inputs
  const [leftRow0, setLeftRow0] = useState([0, 0, 0, 0, 0]); // skewed row 0: [a01, a00, 0, 0]
  const [leftRow1, setLeftRow1] = useState([0, 0, 0, 0, 0]); // skewed row 1: [0, a11, a10, 0]
  // Top inputs
  const [topCol0, setTopCol0] = useState([0, 0, 0, 0, 0]); // skewed col 0: [b10, b00, 0, 0]
  const [topCol1, setTopCol1] = useState([0, 0, 0, 0, 0]); // skewed col 1: [0, b11, b01, 0]

  const initSimulation = () => {
    setCycle(0);
    setPe00(0);
    setPe01(0);
    setPe10(0);
    setPe11(0);
    
    // Skewing the inputs for systolic architecture:
    // Row 0 inputs: a00 enters at cycle 1, a01 enters at cycle 2.
    // Row 1 inputs: a10 enters at cycle 2, a11 enters at cycle 3. (delayed by 1 cycle)
    // Col 0 inputs: b00 enters at cycle 1, b10 enters at cycle 2.
    // Col 1 inputs: b01 enters at cycle 2, b11 enters at cycle 3. (delayed by 1 cycle)
    
    // Arrays indexed by cycle (0-indexed, cycle 0 is idle setup)
    setLeftRow0([0, a00, a01, 0, 0]);
    setLeftRow1([0, 0, a10, a11, 0]);
    
    setTopCol0([0, b00, b10, 0, 0]);
    setTopCol1([0, 0, b01, b11, 0]);
  };

  const handleStep = () => {
    if (cycle >= 5) return;
    
    const nextCycle = cycle + 1;
    setCycle(nextCycle);

    // Get input values at the current cycle boundary
    const a0 = leftRow0[nextCycle] || 0;
    const a1 = leftRow1[nextCycle] || 0;
    const b0 = topCol0[nextCycle] || 0;
    const b1 = topCol1[nextCycle] || 0;

    // In a systolic array, matrix elements pass through:
    // PE(0,0): receives Row0 and Col0
    // PE(0,1): receives Row0 (delayed/passed from PE00) and Col1
    // PE(1,0): receives Row1 and Col0 (delayed/passed from PE00)
    // PE(1,1): receives Row1 (passed from PE10) and Col1 (passed from PE01)

    // Mathematically, let's trace the values arriving at each PE per cycle:
    // Cycle 1:
    //   PE00 receives: leftRow0[1] = a00, topCol0[1] = b00. PE00 += a00 * b00
    // Cycle 2:
    //   PE00 receives: leftRow0[2] = a01, topCol0[2] = b10. PE00 += a01 * b10. (PE00 math complete!)
    //   PE01 receives: Row0 value passing from PE00 (which was leftRow0[1] = a00) and topCol1[2] = b01. PE01 += a00 * b01
    //   PE10 receives: leftRow1[2] = a10 and Col0 value passing from PE00 (which was topCol0[1] = b00). PE10 += a10 * b00
    // Cycle 3:
    //   PE01 receives: Row0 value passing from PE00 (which was leftRow0[2] = a01) and topCol1[3] = b11. PE01 += a01 * b11. (PE01 complete!)
    //   PE10 receives: leftRow1[3] = a11 and Col0 value passing from PE00 (which was topCol0[2] = b10). PE10 += a11 * b10. (PE10 complete!)
    //   PE11 receives: Row1 value passed from PE10 (which was leftRow1[2] = a10) and Col1 value passed from PE01 (which was topCol1[2] = b01). PE11 += a10 * b01
    // Cycle 4:
    //   PE11 receives: Row1 value passed from PE10 (which was leftRow1[3] = a11) and Col1 value passed from PE01 (which was topCol1[3] = b11). PE11 += a11 * b11. (PE11 complete!)

    if (nextCycle === 1) {
      setPe00((prev) => prev + a00 * b00);
    } 
    else if (nextCycle === 2) {
      setPe00((prev) => prev + a01 * b10);
      setPe01((prev) => prev + a00 * b01);
      setPe10((prev) => prev + a10 * b00);
    } 
    else if (nextCycle === 3) {
      setPe01((prev) => prev + a01 * b11);
      setPe10((prev) => prev + a11 * b10);
      setPe11((prev) => prev + a10 * b01);
    } 
    else if (nextCycle === 4) {
      setPe11((prev) => prev + a11 * b11);
    }
  };

  useEffect(() => {
    initSimulation();
  }, [a00, a01, a10, a11, b00, b01, b10, b11]);

  return (
    <div className="widget-container">
      <div className="widget-header">
        <h4>2x2 Systolic Array Hardware Accelerator (Cycle-Accurate)</h4>
        <span className="widget-tag" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}>RTL Design Simulation</span>
      </div>
      <p className="widget-desc">
        Change the values in Matrix A and Matrix B. Click Clock Pulse to step through cycles and watch the data shift through processing elements (PEs) using spatial parallelism.
      </p>

      {/* Input grids */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {/* Matrix A */}
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontFamily: 'monospace' }}>MATRIX A</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 45px)', gap: '4px' }}>
            <input type="number" className="matrix-input" value={a00} onChange={(e) => setA00(Number(e.target.value))} />
            <input type="number" className="matrix-input" value={a01} onChange={(e) => setA01(Number(e.target.value))} />
            <input type="number" className="matrix-input" value={a10} onChange={(e) => setA10(Number(e.target.value))} />
            <input type="number" className="matrix-input" value={a11} onChange={(e) => setA11(Number(e.target.value))} />
          </div>
        </div>
        {/* Matrix B */}
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontFamily: 'monospace' }}>MATRIX B</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 45px)', gap: '4px' }}>
            <input type="number" className="matrix-input" value={b00} onChange={(e) => setB00(Number(e.target.value))} />
            <input type="number" className="matrix-input" value={b01} onChange={(e) => setB01(Number(e.target.value))} />
            <input type="number" className="matrix-input" value={b10} onChange={(e) => setB10(Number(e.target.value))} />
            <input type="number" className="matrix-input" value={b11} onChange={(e) => setB11(Number(e.target.value))} />
          </div>
        </div>

        {/* Theoretical Result Matrix */}
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px', fontFamily: 'monospace' }}>MATRIX PRODUCT (C = A x B)</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 45px)', gap: '4px', opacity: 0.6 }}>
            <div className="matrix-output">{a00 * b00 + a01 * b10}</div>
            <div className="matrix-output">{a00 * b01 + a01 * b11}</div>
            <div className="matrix-output">{a10 * b00 + a11 * b10}</div>
            <div className="matrix-output">{a10 * b01 + a11 * b11}</div>
          </div>
        </div>
      </div>

      {/* Systolic Grid Layout */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#0a0d16', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px', minHeight: '220px' }}>
        
        {/* Cycle indicator */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
          ⏱️ CLK CYCLE: {cycle} / 4
        </div>

        {/* Input labels showing skewed data */}
        <div style={{ display: 'flex', gap: '30px', marginBottom: '10px', marginLeft: '60px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '10px', color: 'var(--text-secondary)' }}>
            <span>Col0 Input: {topCol0[cycle + 1] !== undefined ? topCol0[cycle + 1] : 0}</span>
            <span style={{ fontSize: '8px', color: '#64748b' }}>[Queue: {topCol0.slice(cycle + 1).join(', ')}]</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '10px', color: 'var(--text-secondary)' }}>
            <span>Col1 Input: {topCol1[cycle + 1] !== undefined ? topCol1[cycle + 1] : 0}</span>
            <span style={{ fontSize: '8px', color: '#64748b' }}>[Queue: {topCol1.slice(cycle + 1).join(', ')}]</span>
          </div>
        </div>

        {/* The 2x2 Processing Elements */}
        <div style={{ display: 'flex', gap: '15px' }}>
          
          {/* Row Labels Left */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingRight: '10px', fontSize: '10px', color: 'var(--text-secondary)', height: '130px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span>Row0: {leftRow0[cycle + 1] !== undefined ? leftRow0[cycle + 1] : 0}</span>
              <span style={{ fontSize: '8px', color: '#64748b' }}>[{leftRow0.slice(cycle + 1).join(', ')}]</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span>Row1: {leftRow1[cycle + 1] !== undefined ? leftRow1[cycle + 1] : 0}</span>
              <span style={{ fontSize: '8px', color: '#64748b' }}>[{leftRow1.slice(cycle + 1).join(', ')}]</span>
            </div>
          </div>

          {/* Core PEs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 90px)', gap: '15px' }}>
            {/* PE 0,0 */}
            <div className={`pe-cell ${cycle >= 2 ? 'pe-complete' : cycle >= 1 ? 'pe-active' : ''}`}>
              <span className="pe-id">PE(0,0)</span>
              <div className="pe-val">{pe00}</div>
              <span className="pe-op">c00 += a0 * b0</span>
            </div>
            {/* PE 0,1 */}
            <div className={`pe-cell ${cycle >= 3 ? 'pe-complete' : cycle >= 2 ? 'pe-active' : ''}`}>
              <span className="pe-id">PE(0,1)</span>
              <div className="pe-val">{pe01}</div>
              <span className="pe-op">c01 += a0 * b1</span>
            </div>
            {/* PE 1,0 */}
            <div className={`pe-cell ${cycle >= 3 ? 'pe-complete' : cycle >= 2 ? 'pe-active' : ''}`}>
              <span className="pe-id">PE(1,0)</span>
              <div className="pe-val">{pe10}</div>
              <span className="pe-op">c10 += a1 * b0</span>
            </div>
            {/* PE 1,1 */}
            <div className={`pe-cell ${cycle >= 4 ? 'pe-complete' : cycle >= 3 ? 'pe-active' : ''}`}>
              <span className="pe-id">PE(1,1)</span>
              <div className="pe-val">{pe11}</div>
              <span className="pe-op">c11 += a1 * b1</span>
            </div>
          </div>

        </div>
      </div>

      {/* Control panel */}
      <div className="widget-controls" style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
        <button 
          onClick={handleStep} 
          disabled={cycle >= 4}
          className="widget-btn" 
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', opacity: cycle >= 4 ? 0.4 : 1 }}
        >
          Clock Pulse (Next Step)
        </button>
        <button 
          onClick={initSimulation} 
          className="widget-btn"
          style={{ borderColor: '#64748b', color: '#64748b' }}
        >
          Reset Simulation
        </button>
        {cycle >= 4 && (
          <span style={{ marginLeft: 'auto', alignSelf: 'center', color: '#22c55e', fontSize: '12px', fontFamily: 'monospace', fontWeight: 'bold' }}>
            🎉 Computation Complete! Product Matrix matches ideal result.
          </span>
        )}
      </div>
    </div>
  );
};
