/ RGBA (buffer F, w x h words; the frame tag is texel (8, h) of texture T; w x h, plus a frame-tag texel at (8, h)) to NV12, BT.709 limited range in 8.8 fixed point.
/ One output word per thread: four luma bytes, or two interleaved chroma pairs (each the mean of a 2x2 block),
/ or, last, the tag texel. Coordinates are clamped so the branch not taken stays in bounds.
ny:(w*h)%4
nuv:(w*h)%8
/ luma: pixels 4i..4i+3
p:(4*i)&(w*h)-4
ly:p%w
lx:p!w
/ dither: a 4x4 ordered (Bayer) offset in place of the +128 rounding, mean 128, fixed per pixel so a render is
/ still a function of its frame; 8-bit limited range bands slow dark gradients without it
yb0:and[ly;1]
yb1:and[shr[ly;1];1]
e0:xor[and[lx+0;3];and[ly;3]]
o0:(16*((8*and[e0;1])+((4*yb0)+((2*and[shr[e0;1];1])+yb1))))+8
e1:xor[and[lx+1;3];and[ly;3]]
o1:(16*((8*and[e1;1])+((4*yb0)+((2*and[shr[e1;1];1])+yb1))))+8
e2:xor[and[lx+2;3];and[ly;3]]
o2:(16*((8*and[e2;1])+((4*yb0)+((2*and[shr[e2;1];1])+yb1))))+8
e3:xor[and[lx+3;3];and[ly;3]]
o3:(16*((8*and[e3;1])+((4*yb0)+((2*and[shr[e3;1];1])+yb1))))+8
c0:word[F;((ly)*w)+lx+0]
y0:clamp[16+shr[(47*and[c0;255])+(157*and[shr[c0;8];255])+(16*and[shr[c0;16];255])+o0;8];0;255]
c1:word[F;((ly)*w)+lx+1]
y1:clamp[16+shr[(47*and[c1;255])+(157*and[shr[c1;8];255])+(16*and[shr[c1;16];255])+o1;8];0;255]
c2:word[F;((ly)*w)+lx+2]
y2:clamp[16+shr[(47*and[c2;255])+(157*and[shr[c2;8];255])+(16*and[shr[c2;16];255])+o2;8];0;255]
c3:word[F;((ly)*w)+lx+3]
y3:clamp[16+shr[(47*and[c3;255])+(157*and[shr[c3;8];255])+(16*and[shr[c3;16];255])+o3;8];0;255]
yw:or[or[y0;shl[y1;8]];or[shl[y2;16];shl[y3;24]]]
/ chroma: samples 2j and 2j+1 of the (w/2) x (h/2) grid, j counting from the first chroma word
j:0|(i-ny)&nuv-1
s:2*j
cr:s%(w%2)
cc:s!(w%2)
/ chroma's dither: the same pattern on the chroma grid, mean 512 for the 2x2 sum's shift by 10
cb0:and[cr;1]
cb1:and[shr[cr;1];1]
f0:xor[and[cc+0;3];and[cr;3]]
q0:(64*((8*and[f0;1])+((4*cb0)+((2*and[shr[f0;1];1])+cb1))))+32
f1:xor[and[cc+1;3];and[cr;3]]
q1:(64*((8*and[f1;1])+((4*cb0)+((2*and[shr[f1;1];1])+cb1))))+32
x0:2*cc+0
t00:word[F;((2*cr)*w)+x0]
t01:word[F;((2*cr)*w)+x0+1]
t02:word[F;(((2*cr)+1)*w)+x0]
t03:word[F;(((2*cr)+1)*w)+x0+1]
r0:and[t00;255]+and[t01;255]+and[t02;255]+and[t03;255]
g0:and[shr[t00;8];255]+and[shr[t01;8];255]+and[shr[t02;8];255]+and[shr[t03;8];255]
b0:and[shr[t00;16];255]+and[shr[t01;16];255]+and[shr[t02;16];255]+and[shr[t03;16];255]
u0:clamp[128+shr[(-26*r0)+(-87*g0)+(112*b0)+q0;10];0;255]
v0:clamp[128+shr[(112*r0)+(-102*g0)+(-10*b0)+q0;10];0;255]
x1:2*cc+1
t10:word[F;((2*cr)*w)+x1]
t11:word[F;((2*cr)*w)+x1+1]
t12:word[F;(((2*cr)+1)*w)+x1]
t13:word[F;(((2*cr)+1)*w)+x1+1]
r1:and[t10;255]+and[t11;255]+and[t12;255]+and[t13;255]
g1:and[shr[t10;8];255]+and[shr[t11;8];255]+and[shr[t12;8];255]+and[shr[t13;8];255]
b1:and[shr[t10;16];255]+and[shr[t11;16];255]+and[shr[t12;16];255]+and[shr[t13;16];255]
u1:clamp[128+shr[(-26*r1)+(-87*g1)+(112*b1)+q1;10];0;255]
v1:clamp[128+shr[(112*r1)+(-102*g1)+(-10*b1)+q1;10];0;255]
uvw:or[or[u0;shl[v0;8]];or[shl[u1;16];shl[v1;24]]]
px:sel[i<ny;yw;sel[i<ny+nuv;uvw;tex[T;8;h]]]
