import json
D=json.load(open('/Users/vijaychilaka/Downloads/startup-ideas/deal-desk/docs/video/voice/audio/calm/durations.json'))
M=[186.67,195.60,200.70,204.53,210.43,215.83,237.63,247.57,264.23,271.60,283.17,324.07,334.13,351.47,365.67,387.87,398.40,419.77,431.63,441.23,472.83,476.03,482.60,487.93,520.23,539.13,559.07,563.13,569.93,578.97,583.87,615.70,625.30,760.43,772.43,773.67,796.33,816.70,822.03,863.43,871.63,888.37,924.43,933.07,945.20]
ids=['h1','h2','h3','h4','h5','h6','v1','v2','v3','v4','v5','w0','w1','w2','w3','w4','w5','w6','w7','w8','x1','x2','x3','d1','d2','d3','d4','d5','d6','a1','a2','a4','a5','l1','l2a','l2b','l3','l4','l5','n1','n2','n3','w9a','w9b','w9c']
EV=dict(zip(ids,M))
if __name__=='__main__':
    for i,k in enumerate(ids):
        if k.startswith('x'): continue
        nxt=M[i+1]-M[i] if i+1<len(M) else 99
        d=D.get(k,0)
        print(f"{k:4s} M={M[i]:7.2f} avail={nxt:6.1f} D={d:5.1f} {'SHORT %.1f'%(d+0.8-nxt) if d+0.8>nxt else ''}")
