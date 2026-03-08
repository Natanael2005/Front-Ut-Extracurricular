"use client"
import React, { useEffect, useRef } from "react"

export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // --- MOTOR MATEMÁTICO ( Joseph Gentle Implementation ) ---
    const noise: any = {}
    const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]
    const perm = new Array(512); const gradP = new Array(512)
    const fade = (t: number) => t*t*t*(t*(t*6-15)+10)
    const lerp = (a: number, b: number, t: number) => (1-t)*a + t*b
    
    class Grad {
      x: number; y: number; z: number;
      constructor(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; }
      dot3(x: number, y: number, z: number) { return this.x*x + this.y*y + this.z*z; }
    }
    const grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)]

    noise.seed = (seed: number) => {
      if(seed > 0 && seed < 1) seed *= 65536;
      seed = Math.floor(seed);
      if(seed < 256) seed |= seed << 8;
      for(let i = 0; i < 256; i++) {
        let v = i & 1 ? p[i] ^ (seed & 255) : p[i] ^ ((seed>>8) & 255)
        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
      }
    }

    noise.perlin3 = (x: number, y: number, z: number) => {
      let X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255
      x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z)
      const u = fade(x), v = fade(y), w = fade(z)
      const n000 = gradP[X+perm[Y+perm[Z]]].dot3(x, y, z)
      const n001 = gradP[X+perm[Y+perm[Z+1]]].dot3(x, y, z-1)
      const n010 = gradP[X+perm[Y+1+perm[Z]]].dot3(x, y-1, z)
      const n011 = gradP[X+perm[Y+1+perm[Z+1]]].dot3(x, y-1, z-1)
      const n100 = gradP[X+1+perm[Y+perm[Z]]].dot3(x-1, y, z)
      const n101 = gradP[X+1+perm[Y+perm[Z+1]]].dot3(x-1, y, z-1)
      const n110 = gradP[X+1+perm[Y+1+perm[Z]]].dot3(x-1, y-1, z)
      const n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1)

      return lerp(lerp(lerp(n000, n100, u), lerp(n001, n101, u), w), lerp(lerp(n010, n110, u), lerp(n011, n111, u), w), v)
    }

    // --- CONFIGURACIÓN DE ANIMACIÓN ---
    let zCoord = Math.random() * 222
    const spd = 0.005 // Velocidad sutil
    const scale = 0.002 // Menos detalle para evitar "cuadros"
    const pos = 8 // Reducimos el salto para suavidad

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resize)
    resize()
    noise.seed(zCoord)

    const render = () => {
      ctx.fillStyle = "#010b1a" // El fondo oscuro NexaBot
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for(let x = 0; x < canvas.width; x += pos) {
        for(let y = 0; y < canvas.height; y += pos) {
          const value = noise.perlin3(x * scale, y * scale, zCoord)
          
          // Efecto de seda: Dibujamos rectángulos en lugar de círculos 
          // que se funden entre sí para eliminar la rejilla
          const opacity = Math.abs(value) * 0.12 // Brillo apagado y sutil
          
          ctx.fillStyle = `rgba(0, 255, 128, ${opacity})` // Verde NexaBot
          ctx.fillRect(x, y, pos + 1, pos + 1) // +1 para que se solapen y no haya rejilla
        }
      }
      zCoord += spd
      animationFrameId = requestAnimationFrame(render)
    }

    let animationFrameId = requestAnimationFrame(render)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full object-cover z-0"
    />
  )
}