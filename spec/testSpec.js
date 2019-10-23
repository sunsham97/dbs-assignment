var rewire = require('rewire');

var mod = rewire('../src/main');
describe('forex updating table',()=>{
    const data = {
        "name": "usdjpy",
        "bestBid": 106,
        "bestAsk": 107,
        "openBid": 107,
        "openAsk": 109,
        "lastChangeAsk": -4,
        "lastChangeBid": -2
      };

    //   const forexPairs ,midPrices;
      var updateMidPrice = mod.__get__("updateMidPrice");
      var updatePair = mod.__get__("updatePair");
      var createRow = mod.__get__("createRow");

      beforeEach(()=>{
          mod.__set__("forexPairs",{})
          mod.__set__("midPrices",{})
      });

      describe('updatePair method',()=>{
          console.log('testing updatePair method')
          it('should update the pair when added/updated',()=>{
                console.log('update the pair when added/updated')
                expect(mod.__get__("forexPairs")).toEqual({});
                console.log('forexPairs object initially empty check passed')
                updatePair(data);
                expect(mod.__get__("forexPairs")['usdjpy']).toEqual({
                    "name": "usdjpy",
                    "bestBid": 106,
                    "bestAsk": 107,
                    "openBid": 107,
                    "openAsk": 109,
                    "lastChangeAsk": -4,
                    "lastChangeBid": -2
                  });
                  console.log('forexPairs successfully changed')
          })
      })
      
      describe('updateMidPrice method',()=>{
          console.log('testing updateMidPrice method')
          it('it should update the midPrice for the given currency pair',()=>{
              console.log('should update the midprice for given currency pair')
              mod.__set__('midPrices',{'usdjpy':[]});
              expect(mod.__get__('midPrices')['usdjpy'].length).toEqual(0)
              console.log('midprices object initialised with an empty array for a currency pair')
              updatePair(data);
              updateMidPrice('usdjpy');
              expect(mod.__get__('midPrices')['usdjpy']).toEqual([106.5])
              console.log('midPrices object updated successfully')
              for (let i=0;i<=29;i++) updateMidPrice('usdjpy');
              expect(mod.__get__('midPrices')['usdjpy'].length).toEqual(30)
              console.log('checked for multiple entries')
        })

      })

      describe('updateAllMidPrices method',()=>{
          console.log('testing updateAllMidprices')
          it('it should update mid prices for all the pairs(base case)',()=>{
            console.log('testing for base case')  
            updatePair(data);
              mod.updateAllMidPrices(data);
              expect(mod.__get__('midPrices')['usdjpy']).toEqual([106.5])
              console.log('base case passed')
          });
          it('it should update mid prices for all the pairs',()=>{
            console.log('testing for multiple pairs')
            updatePair(data);
            mod.updateAllMidPrices(data);
            let newData = {
                "name": "gbpchf",
                "bestBid": 1.4,
                "bestAsk": 1.6,
                "openBid": 1.45,
                "openAsk": 1.65,
                "lastChangeAsk": -4,
                "lastChangeBid": -2
              }; 
            updatePair(newData);
            mod.updateAllMidPrices(newData);
            expect(mod.__get__('forexPairs')[newData.name]).toEqual(newData);
            expect(mod.__get__('midPrices')).toEqual({
                "usdjpy": [106.5,106.5],
                "gbpchf": [1.5]
            })
            console.log('test passed')
        });
      });

     describe('createRow method',() => {
        console.log('testing createRow method')
        it('should return a dynamic row based on the forex pair object', () => {
            console.log('should return new table row')
            expect(createRow(data)).toEqual("<tr>"+
            "<td>usdjpy</td>"+
            "<td>106</td>"+
            "<td>107</td>"+
            "<td>-2</td>"+
            "<td>-4</td>"+
            "<td><span id=usdjpy></span></td>"+
          "</tr>");
          console.log('test passed')
        })
     });

})