GOL = require '../../server/GOL.js' 
helper = require '../helpers/GOL_helper.js'

describe 'updateNeighborCount ', -> 
	environment = {}
	expectedEnvironment = {}
	beforeEach ->
	  	environment = helper.setUpEnvironment(5,5)
	  	expectedEnvironment = helper.setUpEnvironment(5,5)
	  	GOL.changeGridSize(5,5);
	it 'updates all 8 neighbors', ->
		expectedEnvironment['cell1-1'].neighbors++
		expectedEnvironment['cell1-2'].neighbors++
		expectedEnvironment['cell1-3'].neighbors++
		expectedEnvironment['cell2-1'].neighbors++
		expectedEnvironment['cell2-3'].neighbors++
		expectedEnvironment['cell3-1'].neighbors++
		expectedEnvironment['cell3-2'].neighbors++
		expectedEnvironment['cell3-3'].neighbors++
		liveCells = {}
		cell = environment['cell2-2'];
		GOL.updateNeighborCount(cell,environment, liveCells, 1)
		expect(expectedEnvironment).toEqual environment
	it 'only updates 3 neighbors part1', ->
		expectedEnvironment['cell0-1'].neighbors++
		expectedEnvironment['cell1-1'].neighbors++
		expectedEnvironment['cell1-0'].neighbors++
		cell = environment['cell0-0'];
		liveCells = {}
		GOL.updateNeighborCount(cell,environment, liveCells, 1)
		expect(expectedEnvironment).toEqual environment
	it 'only updates 3 neighbors part2', ->
		expectedEnvironment['cell3-3'].neighbors++
		expectedEnvironment['cell3-4'].neighbors++
		expectedEnvironment['cell4-3'].neighbors++
		cell = environment['cell4-4'];
		liveCells = {}
		GOL.updateNeighborCount(cell,environment, liveCells, 1)
		expect(expectedEnvironment).toEqual environment
	it 'excludes cels out of bounds', ->
		cell = helper.cell(-1,-1,false,0);
		liveCells = {}
		GOL.updateNeighborCount(cell,environment, liveCells, 1)
		expect(expectedEnvironment).toEqual environment
	it 'excludes cels out of bounds', ->
		cell = helper.cell(5,5,false,0);
		liveCells = {}
		GOL.updateNeighborCount(cell,environment, liveCells, 1)
		expect(expectedEnvironment).toEqual environment
	  
describe 'countNeighbors ', ->
	it '', -> 
	  
  

		
