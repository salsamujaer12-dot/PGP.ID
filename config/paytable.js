const PAYTABLE = {
  SYMBOLS: {
    WILD:           { id: 'WILD',           label: '🀄', name: 'Wild',         pays: [0,0,0,0,0],       isWild: true,  img: 'bacotwild.png' },
    DRAGON_RED:     { id: 'DRAGON_RED',     label: '🐉', name: 'Red Dragon',   pays: [0,5,25,100,500],  img: 'mama.png', imgWild: 'mamawild.png' },
    DRAGON_BLACK:   { id: 'DRAGON_BLACK',   label: '🐲', name: 'Black Dragon', pays: [0,5,20,80,400],   img: 'tung.png', imgWild: 'tungw.png' },
    BAMBOO:         { id: 'BAMBOO',         label: '🎋', name: 'Bamboo',       pays: [0,3,15,60,250],   img: '1.png', imgWild: '1w.png' },
    CIRCLE:         { id: 'CIRCLE',         label: '🔮', name: 'Circle',       pays: [0,3,12,50,200],   img: '2dot.png', imgWild: '2dot_wild.png' },
    CHARACTER:      { id: 'CHARACTER',      label: '㊗', name: 'Character',    pays: [0,2,10,40,150],   img: '3dot.png', imgWild: '3dot_wild.png' },
    WIND_N:         { id: 'WIND_N',         label: '🌀', name: 'North Wind',   pays: [0,2,8,30,100],    img: '5.png', imgWild: '5w.png' },
    WIND_S:         { id: 'WIND_S',         label: '💨', name: 'South Wind',   pays: [0,1,5,20,75],     img: '6.png', imgWild: '6w.png' },
    FLOWER:         { id: 'FLOWER',         label: '🌸', name: 'Flower',       pays: [0,1,4,15,50],     img: 'kotak.png', imgWild: 'kotakwild.png' },
    SEASON:         { id: 'SEASON',         label: '🍂', name: 'Season',       pays: [0,1,3,10,40],     img: 'bacot.png', imgWild: 'bacotwild.png' },
    GOLDEN:         { id: 'GOLDEN',         label: '⭐', name: 'Golden',       pays: [0,2,10,40,150],   isGolden: true, img: 'kotak.png' },
    SCATTER_RED:    { id: 'SCATTER_RED',    label: '🔴', name: 'Red Scatter',         isScatter: true, scatterType: 'red',    img: 'blackscatter.png' },
    SCATTER_BLACK:  { id: 'SCATTER_BLACK',  label: '⚫', name: 'Black Scatter',       isScatter: true, scatterType: 'black',  img: 'blackscatter.png' },
    SCATTER_GOLDEN: { id: 'SCATTER_GOLDEN', label: '🟡', name: 'Golden Scatter',      isScatter: true, scatterType: 'golden', img: 'trigerblackscatter.png' },
  },
  REGULAR_SYMBOLS: ['DRAGON_RED','DRAGON_BLACK','BAMBOO','CIRCLE','CHARACTER','WIND_N','WIND_S','FLOWER','SEASON','GOLDEN'],
  SCATTER_SYMBOLS: ['SCATTER_RED','SCATTER_BLACK','SCATTER_GOLDEN'],
  REELS: 5,
  ROWS: 4,
  WAYS: 2048
};
