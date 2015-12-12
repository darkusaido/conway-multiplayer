Env = require '../../server/environment.js'
Cell = require '../../server/cell.js'
helper = require '../helpers/environmentHelper.js'
_ = require 'lodash'

describe 'constructor should ', ->
	env1 = {}
	env2 = {}
	beforeEach ->
		env1 = new Env(4,3)
		env2 = new Env(3,4)
	it 'encapsulate instance vars', ->
		expect(env1._cells).not.toBeDefined()
	it 'create x by y array of cells', ->
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]]
		expect(env1.cellsEquals(testArr)).toBeTruthy()
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2)],
					[new Cell(3,0),new Cell(3,1),new Cell(3,2)]]
		expect(env2.cellsEquals(testArr)).toBeTruthy()
	it 'initializes liveCells to empty object', -> 
		expect(_.isEqual(env1.liveCells, {})).toBeTruthy()
	
describe 'cellsEquals should ', -> 
	env1 = {}
	beforeEach ->
		env1 = new Env(4,3)
	it 'return true if cells are equal', ->
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]]
		expect(env1.cellsEquals(testArr)).toBeTruthy()
	it 'return false if cells are of different dimensions', ->
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]]
		expect(env1.cellsEquals(testArr)).toBeFalsy()
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3), new Cell(1,4)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]]
		expect(env1.cellsEquals(testArr)).toBeFalsy()
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)]]
		expect(env1.cellsEquals(testArr)).toBeFalsy()
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)],
					[new Cell(3,0),new Cell(3,1),new Cell(3,2),new Cell(3,3)]]
		expect(env1.cellsEquals(testArr)).toBeFalsy()
	it 'return false if individual cells are not equal', ->
		testArr = [ [new Cell(1,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]]
		expect(env1.cellsEquals(testArr)).toBeFalsy()
	it 'return false if comparing against a nonArray', ->
		testObj = { 
					0:[new Cell(0,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)]
					1:[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)]
					2:[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]
				  }
		expect(env1.cellsEquals(testObj)).toBeFalsy()
		testObj = [ {
						0:new Cell(0,0)
						1:new Cell(0,1)
						3:new Cell(0,2)
						4:new Cell(0,3)
					},
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]]
		expect(env1.cellsEquals(testObj)).toBeFalsy()

describe 'flipCell should ', ->
	env1 = {}
	beforeEach ->
		env1 = new Env(4,3)
	it 'throw RangeException when flipping cell out of bounds', ->
		expect(() -> env1.flipCell(-1,0)).toThrow(new RangeError("index out of bounds"))
		expect(() -> env1.flipCell(0,-1)).toThrow(new RangeError("index out of bounds"))
		expect(() -> env1.flipCell(3,0)).toThrow(new RangeError("index out of bounds"))
		expect(() -> env1.flipCell(0,4)).toThrow(new RangeError("index out of bounds"))
		expect(() -> env1.flipCell(3,4)).toThrow(new RangeError("index out of bounds"))
		expect(() -> env1.flipCell(-1,-1)).toThrow(new RangeError("index out of bounds"))
	it 'set cell with value of 1 if cell is currently 0, and viceversa', ->
		liveCell = new Cell(1,1)
		liveCell.toggleLife()
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)],
					[new Cell(1,0),liveCell,new Cell(1,2),new Cell(1,3)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]]
		env1.flipCell(1,1)
		expect(env1.cellsEquals(testArr)).toBeTruthy()
		testArr = [ [new Cell(0,0),new Cell(0,1),new Cell(0,2),new Cell(0,3)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2),new Cell(1,3)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2),new Cell(2,3)]]
		env1.flipCell(1,1)
		expect(env1.cellsEquals(testArr)).toBeTruthy()
	it 'add cell to liveCells if it is going from !alive to alive', ->
		env1.flipCell(0,0)
		env1.flipCell(1,1)
		env1.flipCell(2,2)
		cell00 = new Cell(0,0) 
		cell11 = new Cell(1,1) 
		cell22 = new Cell(2,2)
		cell00.toggleLife()
		cell11.toggleLife()
		cell22.toggleLife()
		expectedLiveCells = {
								'0-0': cell00
								'1-1': cell11
								'2-2': cell22
							}
		expect(helper.cellsObjectsEquals(env1.liveCells,expectedLiveCells)).toBeTruthy()
	it 'remove cell from liveCells if it is going from alive to !alive', ->
		env1.flipCell(0,0)
		env1.flipCell(1,1)
		env1.flipCell(2,2)
		env1.flipCell(0,0)
		env1.flipCell(1,1)
		env1.flipCell(2,2)
		cell00 = new Cell(0,0) 
		cell11 = new Cell(1,1) 
		cell22 = new Cell(2,2)
		expectedLiveCells = {
								'0-0': cell00
								'1-1': cell11
								'2-2': cell22
							}
		expect(helper.cellsObjectsEquals(env1.liveCells,expectedLiveCells)).toBeFalsy()
	

describe 'toString should', ->
	env1 = {}
	beforeEach ->
		env1 = new Env(3,4)
	it 'return string in correct format', ->
		env1.flipCell(1,1)
		expectedString = """
		0 0 0 0 
		0 1 0 0 
		0 0 0 0 \n
		"""
		expect(env1.toString()).toEqual expectedString

describe 'cells setter should ', ->
	env1 = {}
	beforeEach ->
		env1 = new Env(3,4)
	it 'not keep a reference to value passed alive', ->
		arr =   [   [new Cell(0,0),new Cell(0,1),new Cell(0,2)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2)],
					[new Cell(3,0),new Cell(3,1),new Cell(3,2)]]
		arr2 =  [ 	[new Cell(0,0),new Cell(0,1),new Cell(0,2)],
				    [new Cell(1,0),new Cell(1,1),new Cell(1,2)],
				    [new Cell(2,0),new Cell(2,1),new Cell(2,2)],
					[new Cell(3,0),new Cell(3,1),new Cell(3,2)]]
		env1.cells = arr
		arr[1][1].toggleLife()
		expect(env1.cellsEquals(arr2)).toBeTruthy()
		expect(env1.cellsEquals(arr)).toBeFalsy()
	it 'allow you to set cells to objects array of correct dimentions', ->
		arr =   [   [new Cell(0,0),new Cell(0,1),new Cell(0,2)],
					[new Cell(1,0),new Cell(1,1),new Cell(1,2)],
					[new Cell(2,0),new Cell(2,1),new Cell(2,2)],
					[new Cell(3,0),new Cell(3,1),new Cell(3,2)]]
		env1.cells = arr
		expect(env1.cellsEquals(arr)).toBeTruthy()
  

describe 'nextGeneration should update cells according to games of life rules ', ->
	#testing against the toString representation of the environment because 2d arrays in [x][y] format
	#are impossible to represent intuitively in code. Strings will give a better visual representation. 
	describe 'Rule 1: Any live cell with fewer than two live neighbours dies, as if caused by under-population.', ->
		env1 = {}
		beforeEach ->
			env1 = new Env(3,3)
		it 'testcase 1 no neighbors, should die', ->
			expectedEnv = """
			0 0 0 
			0 0 0 
			0 0 0 \n
			"""
			env1.flipCell(1,1)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv
		it 'testcase 2 each has 1 neighbor, both should die', ->
			expectedEnv = """
			0 0 0 
			0 0 0 
			0 0 0 \n
			"""
			env1.flipCell(1,0)
			env1.flipCell(1,1)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv
	describe 'Rule 2: Any live cell with two or three live neighbours lives on to the next generation.', ->
		env1 = {}
		beforeEach ->
			env1 = new Env(3,3)
		it 'testcase 1 the cells with 2 neighbors and the cells with 3 neighbors should live, rest should die', ->
			expectedEnv = """
			1 1 1 
			0 0 0 
			0 1 0 \n
			"""
			env1.flipCell(0,0)
			env1.flipCell(1,0)
			env1.flipCell(2,0)
			env1.flipCell(1,1)
			env1.flipCell(0,2)
			env1.flipCell(2,2)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv
	describe 'Rule 3: Any live cell with more than three live neighbours dies, as if by over-population.', ->
		env1 = {}
		beforeEach ->
			env1 = new Env(3,3)
		it 'testcase 1 the cell with 4 neighbors should die, cell with 3 neighbors should live', ->
			expectedEnv = """
			1 0 1 
			1 0 1 
			0 0 0 \n
			"""
			env1.flipCell(0,0)
			env1.flipCell(1,0)
			env1.flipCell(2,0)
			env1.flipCell(0,1)
			env1.flipCell(1,1)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv
		it 'testcase 2 the cell with 4 neighbors and above should die, rest should live', ->
			expectedEnv = """
			1 0 1 
			0 0 0 
			1 0 1 \n
			"""
			env1.flipCell(0,0)
			env1.flipCell(1,0)
			env1.flipCell(2,0)
			env1.flipCell(0,1)
			env1.flipCell(1,1)
			env1.flipCell(2,1)
			env1.flipCell(0,2)
			env1.flipCell(1,2)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv
	describe 'Rule 4: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.', ->
		env1 = {}
		beforeEach ->
			env1 = new Env(3,3)
		it 'testcase 1 dead cell with 4 neighbors should be born', ->
			expectedEnv = """
			0 1 0 
			0 1 0 
			0 0 0 \n
			"""
			env1.flipCell(0,0)
			env1.flipCell(1,0)
			env1.flipCell(2,0)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv
	describe 'and keep track of which cells are alive ', ->
		env1 = {}
		beforeEach ->
			env1 = new Env(7,7)
		it 'test1: ', -> 
			#blinker
			env1.flipCell(1,0)
			env1.flipCell(1,1)
			env1.flipCell(1,2)
			#block
			env1.flipCell(4,1)
			env1.flipCell(4,2)
			env1.flipCell(5,1)
			env1.flipCell(5,2)	
			#initially dead		
			cell01 = new Cell(0,1) 
			cell21 = new Cell(2,1) 
			#initially alive
			cell10 = new Cell(1,0) 
			cell11 = new Cell(1,1) 
			cell12 = new Cell(1,2)
			cell41 = new Cell(4,1) 
			cell42 = new Cell(4,2) 
			cell51 = new Cell(5,1)
			cell52 = new Cell(5,2)			
			cell10.toggleLife()
			cell11.toggleLife()
			cell12.toggleLife()
			cell41.toggleLife()
			cell42.toggleLife()
			cell51.toggleLife()
			cell52.toggleLife()
			expectedLiveCells = {
									'1-0': cell10
									'1-1': cell11
									'1-2': cell12
									'4-1': cell41
									'4-2': cell42
									'5-1': cell51
									'5-2': cell52
								}
			expect(helper.cellsObjectsEquals(env1.liveCells,expectedLiveCells)).toBeTruthy()
			env1.nextGeneration()
			#come to life
			cell01.toggleLife()
			cell21.toggleLife()
			expectedLiveCells = {
									'0-1': cell01
									'1-1': cell11
									'2-1': cell21
									'4-1': cell41
									'4-2': cell42
									'5-1': cell51
									'5-2': cell52
								}
			expect(helper.cellsObjectsEquals(env1.liveCells,expectedLiveCells)).toBeTruthy()
	describe 'and increments generationNumber ', ->
		it 'test1', ->
			env = new Env(3,3)
			expect(env.generationNumber).toBe 0
			env.nextGeneration()
			expect(env.generationNumber).toBe 1
			env.nextGeneration()
			expect(env.generationNumber).toBe 2
			env.nextGeneration()
			expect(env.generationNumber).toBe 3
			env.nextGeneration()
			expect(env.generationNumber).toBe 4
			env.nextGeneration()
			expect(env.generationNumber).toBe 5
			env.nextGeneration()
			expect(env.generationNumber).toBe 6
			env.nextGeneration()
			expect(env.generationNumber).toBe 7
	describe 'and keep track of the cells newly born and cells that just died', ->
		it 'test1', ->
			env = new Env(3,3)
			env.flipCell(1,0)
			env.flipCell(1,1)
			env.flipCell(1,2)
			cell01 = new Cell(0,1) 
			cell21 = new Cell(2,1) 
			cell10 = new Cell(1,0) 
			cell11 = new Cell(1,1) 
			cell12 = new Cell(1,2)
			cell01.toggleLife()
			cell21.toggleLife()
			env.nextGeneration()
			expectedCellsBorn = {
									'0-1': cell01
									'2-1': cell21
								}
			expectedCellsDied = {
									'1-0': cell10
									'1-2': cell12
								}
			expect(helper.cellsObjectsEquals(env.cellsBorn, expectedCellsBorn)).toBeTruthy()
			expect(helper.cellsObjectsEquals(env.cellsDied, expectedCellsDied)).toBeTruthy()


describe 'idiosyncratic structures: ', ->
	describe 'still lives: ', ->
		it 'block', ->
			env1 = new Env(3,3)
			expectedEnv = """
			1 1 0 
			1 1 0 
			0 0 0 \n
			"""
			env1.flipCell(0,0)
			env1.flipCell(1,0)
			env1.flipCell(0,1)
			env1.flipCell(1,1)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv	
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv
		it 'boat', ->
			env1 = new Env(3,3)
			expectedEnv = """
			1 1 0 
			1 0 1 
			0 1 0 \n
			"""
			env1.flipCell(0,0)
			env1.flipCell(1,0)
			env1.flipCell(0,1)
			env1.flipCell(1,2)
			env1.flipCell(2,1)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv	
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv	
		it 'beehive', ->
			env1 = new Env(5,6)
			expectedEnv = """
			0 0 0 0 0 0 
			0 0 1 1 0 0 
			0 1 0 0 1 0 
			0 0 1 1 0 0 
			0 0 0 0 0 0 \n
			"""
			env1.flipCell(1,2)
			env1.flipCell(2,1)
			env1.flipCell(3,1)
			env1.flipCell(4,2)
			env1.flipCell(2,3)
			env1.flipCell(3,3)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv	
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv	
		it 'loaf', ->
			env1 = new Env(5,6)
			expectedEnv = """
			0 0 0 0 0 0 
			0 0 1 1 0 0 
			0 1 0 0 1 0 
			0 0 1 0 1 0 
			0 0 0 1 0 0 \n
			"""
			env1.flipCell(1,2)
			env1.flipCell(2,1)
			env1.flipCell(3,1)
			env1.flipCell(4,2)
			env1.flipCell(4,3)
			env1.flipCell(2,3)
			env1.flipCell(3,4)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv	
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv	
	describe 'oscillators: ', ->
		it 'blinker', ->
			env1 = new Env(3,3)
			expectedEnv1 = """
			0 0 0 
			1 1 1 
			0 0 0 \n
			"""
			expectedEnv2 = """
			0 1 0 
			0 1 0 
			0 1 0 \n
			"""
			env1.flipCell(1,0)
			env1.flipCell(1,1)
			env1.flipCell(1,2)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv1
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv2
		it 'toad', ->
			env1 = new Env(6,6)
			expectedEnv1 = """
			0 0 0 0 0 0 
			0 0 0 1 0 0 
			0 1 0 0 1 0 
			0 1 0 0 1 0 
			0 0 1 0 0 0 
			0 0 0 0 0 0 \n
			"""
			expectedEnv2 = """
			0 0 0 0 0 0 
			0 0 0 0 0 0 
			0 0 1 1 1 0 
			0 1 1 1 0 0 
			0 0 0 0 0 0 
			0 0 0 0 0 0 \n
			"""
			env1.flipCell(2,2)
			env1.flipCell(3,2)
			env1.flipCell(4,2)
			env1.flipCell(1,3)
			env1.flipCell(2,3)
			env1.flipCell(3,3)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv1
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv2
		it 'beacon', ->
			env1 = new Env(6,6)
			expectedEnv1 = """
			0 0 0 0 0 0 
			0 1 1 0 0 0 
			0 1 0 0 0 0 
			0 0 0 0 1 0 
			0 0 0 1 1 0 
			0 0 0 0 0 0 \n
			"""
			expectedEnv2 = """
			0 0 0 0 0 0 
			0 1 1 0 0 0 
			0 1 1 0 0 0 
			0 0 0 1 1 0 
			0 0 0 1 1 0 
			0 0 0 0 0 0 \n
			"""
			env1.flipCell(1,1)
			env1.flipCell(1,2)
			env1.flipCell(2,1)
			env1.flipCell(2,2)
			env1.flipCell(3,3)
			env1.flipCell(3,4)
			env1.flipCell(4,3)
			env1.flipCell(4,4)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv1
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv2
		it 'pulsar', ->
			env1 = new Env(17,17)
			expectedEnv1 = """
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 0 0 0 0 0 1 1 0 0 0 0 
			0 0 0 0 0 1 1 0 0 0 1 1 0 0 0 0 0 
			0 0 1 0 0 1 0 1 0 1 0 1 0 0 1 0 0 
			0 0 1 1 1 0 1 1 0 1 1 0 1 1 1 0 0 
			0 0 0 1 0 1 0 1 0 1 0 1 0 1 0 0 0 
			0 0 0 0 1 1 1 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 1 1 1 0 0 0 0 
			0 0 0 1 0 1 0 1 0 1 0 1 0 1 0 0 0 
			0 0 1 1 1 0 1 1 0 1 1 0 1 1 1 0 0 
			0 0 1 0 0 1 0 1 0 1 0 1 0 0 1 0 0 
			0 0 0 0 0 1 1 0 0 0 1 1 0 0 0 0 0 
			0 0 0 0 1 1 0 0 0 0 0 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv2 = """
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 1 0 0 0 0 1 0 1 0 0 0 0 1 0 0 
			0 0 1 0 0 0 0 1 0 1 0 0 0 0 1 0 0 
			0 0 1 0 0 0 0 1 0 1 0 0 0 0 1 0 0 
			0 0 0 0 1 1 1 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 1 1 1 0 0 0 0 
			0 0 1 0 0 0 0 1 0 1 0 0 0 0 1 0 0 
			0 0 1 0 0 0 0 1 0 1 0 0 0 0 1 0 0 
			0 0 1 0 0 0 0 1 0 1 0 0 0 0 1 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv3 = """
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 1 0 0 0 1 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 1 1 1 0 0 1 1 0 1 1 0 0 1 1 1 0 
			0 0 0 1 0 1 0 1 0 1 0 1 0 1 0 0 0 
			0 0 0 0 0 1 1 0 0 0 1 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 1 0 0 0 1 1 0 0 0 0 0 
			0 0 0 1 0 1 0 1 0 1 0 1 0 1 0 0 0 
			0 1 1 1 0 0 1 1 0 1 1 0 0 1 1 1 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 1 0 0 0 1 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 \n
			"""
  #     MMMMMMMMMMMMMMMMMMMMMMMMMMNbbhhhbbbbbbbbNMMMMMMMMMMMMMMMMMMMMMMMMMMM  MM  
  # MM  MMMMMMMMMMMMMMMMMMMMMNHHhhl!!!!!!!!ltll!lbHbbbbhttht!thbbNMMMMMMMM  MM  
  # MM  MMMMMMMMMMMMMMMHbhttttttlhhl!!::!!:tHNhtt!ll!!!hNMMMMM  MM  
  #     MMMMMMMMMMMMMHtttl!!l!!!!lttl!::::::!!!l!!!!!!::::lHMMM      
  #     MMMMMMMMMMMMblhtl!::::!ll!:.  !!!!!!!!:.:lHM      
  #     MMMMMMMMMMMb!!!ll!lltl!::::.!!:.::..::::::::::::::!.:t      
  # MM  MMMMMMMMMMH!!lllht!tttttl!:::.::: .:....::::::::::::::  MM  
  # MM  MMMMMMMMHh!!!lll:::::!!!:::.::...::::::::::::::::  MM  
  # MM  MMMMMHtt!l!!l!tl::......:!.:::::...::::::::.:::::::  MM  
  #     MMMMb!!ll!!!l!::.  .. :..:.....::::!:::::..::::::::::::      
  #     MMHl!!!!l::: .:::!. .. :. .::!!:::::::::.:::::::::      
  #     Hl:!:l!t::::.:. :.. .::..::::::::::::.:....:...:      
  # MM  ::::!!::!..:::: .. ::::...... ...........::::::::..:.::.......  MM  
  # MM  :....:!:...::.:.. :: .....::.......::::::.:....:::::::::....:.::..  MM  
  # MM   ..:::::................:. ....:..::.:.......:::..:.:::::::::..::.  MM  
  #     .::.::..          ....:.......:::.. ..........::.:..:..:::::::      
  #     ::::..     ..       :...::::::::.  ....      ....::.:...:::::      
  #     .:.:::  .lthhhl!!.  ...:::!::               .:.::.::..::::::      
  # MM  ..::.  hHHNMNNNNHbt!:.   .:lthhhhtl!:.......     .:: ..::....:!  MM  
  # MM  .:::..tHNNMMMMMMNNNHHht!::!tbbHHHbbbbhttl!!!:..:::. .........:  MM  
  # MM  ..   tMNNMMMMMMNNNNNHHbbbbbbHHHHbbbbbbbhtttll!!!!:::.............:  MM  
  #         !NMMMMMMMMMNNNNNNNHHHHHHHHHbbbbbbbbhhhttlllll!!:.:.........:::      
  #        .bMMMMMMMMMNNNNNNNHHHHHHHHHHbbbbbbhhhhhttttttlll!:::::::::...:      
  #        .bMMMMMNNNNNNNNNNHHHHHHHbbbbbbbbbhhhhhtttttttttl!::::::::::::      
  # MM  :   bMMNNNNNNNNNNNHHHbbbbbbbbhhhhhhhttttttttttttttll!..::::::::::::  MM  
  # MM  N  tMNNNNNNNNNHHHbbbhbhhhhhhthttttttlltttttttttttll!:..::::::::...  MM  
  # MM  MN. !MMNNNNNHHHHbbhhhhhhtthtttttlllllltttttttttttttl!:  .:::...     MM  
  #     MMt :NMNNNNNHHHHbbhhhhhhtthttttlllllltttttttttttttttll!!....... .!l      
  #     MMMl HMMNNNNHHHHHbbhhhhhtthtttttllttttttttttttttttttttttll!:   .  l      
  #     MMMNhMMMNNNNHHHHHbbbbhttthhhtttttthtttthhtttthhhhhhhhhtttht.    .:      
  # MM  MMMHlhMMMMNNNNNNNHHHbbhhhhbbhhhhtthhtthhbhhhhhhhhhhbbbhhhhht!:   th  MM  
  # MM  MMNbhHMNMMMNNNNNHbHHHbhhhbbbbhhttthhhhhhl!!!::!thbbbbhtthl.  hHb  MM  
  # MM  NHbhNNNHHHHHHNNNHhhbhtttlthllltlttttl!:..            .:!hthbbt  hbb  MM  
  #     N! . .::!!lttthtl!!:!l!l!::.                    bbhbh bhl      
  #     MN!   :.               ll:.:::.                      bhhhhtlbbhl      
  #     MMMl  ..             .!!:...                        !bhhhhhhbhhtl      
  # MM  MMMMb :..             .!ll!                        ththhhhhhhhhtl  MM  
  # MM  MMMMMMb.             :hbht!:.                   :!ttttthhhthhhhbt  MM  
  # MM  MMMMMMMMbl:          :llNHbhtl:.             .:!llllttttthhhhhhbt  MM  
  #     MMMMMMMNNNHbh!:.....ltHNNHbhtl!:::..:::::!!!!!!!llllttttthhhhtl      
  #     MMMMMMMMNNHHHHbhbbhttbHNNNHbhtlll!!!!!!!!!!!!!!!!llltlttthhl!      
  #     MMMMMMMMNNHHHHHHHHbbbHNNNNHbttttl!!!!!!!!lll!!!!!!!!!llllllllthl:      
  # MM  MMMMMMMMMNNNHHHHHHbhhbNNNNHbhttlll!!!!!ll!!!!!!!!!!!ll!!lllttl..  MM  
  # MM  MMMMMMMMMMNNNHHHHHhtlbMNNNHbhthtthtl::!!!!!!!!!!!!!!!!l!llll!:     MM  
  # MM  MMMMMMMMMMMMNNHHHbhllMMMMNbhtthhhhhb!::!!!!!!!!!!!!!!!!!!:      MM  
  #     MMMMMMMMMMMMNNNNHbtlbNbHNbtl!!!!!:.:!!!!!l!!!!!!!:.           
  #     MMMMMMMMMMMMMNNNHbhbNNNHNb::.   ..:!!!!::!!!!!!::.             
  #     MMMMMMMMMMMMMMNNHbHNNNNNHHh!:....:!:::!!!:::..               
  # MM  MMMMMMMMMMMMMMMNHHHNNNHHbbh!:!!!:::::::::!!:::.             MM  
  # MM  MMMMMMMMMMMMMMMMNHHHHHHHNNbl!ltl!!!!!!:...:::::::.              MM  
  # MM  MMMMMMMMMMMMMMMMMNHt!tt!::::.             ::::::.                MM  
  #     MMMMMMMMMMMMMMMMMMNbtbbbl.          .:..:::...::::...                    
  #     MMMMMMMMMMMMMMMMMMMNNNHHHHht!!:::::.::::..:::...                     
  #     MMMMMMMMMMMMMMMMMMMMNHHbbht!:::::.....:::::......                        
  # MM  MMMMMMMMMMMMMMMMMMMMMNNHhtl.        ....::......                     MM  
  # MM  MMMMMMMMMMMMMMMMMMMMMhhMHbhhl:::::::::.::.                       MM  
  # MM  MMMMMMMMMMMMMMMMMMMNt  tMHHNHbhtll!!!:::..                        MM  
  #     MMMMMMMMMMMMMMMNbh!.    tNHHhtlll!!::::..                               
  #     MMMMMMMMMNbht!:.        !Nh!!:::.                                    
  #     MMMMMMNh!:....            hNhl!:.      .:::.                              
  # MM  MMNHt   .....             bNHNHh!:.::!:                          MM  
  # MM  MMt:..:t! ....              Hbhhht!!!!t                           MM  
  # MM  NNNNNNNMb  .                !Mbhttl!!lh:                            MM 
			env1.flipCell(1,5)
			env1.flipCell(1,11)
			env1.flipCell(2,5)
			env1.flipCell(2,11)
			env1.flipCell(3,5)
			env1.flipCell(3,6)
			env1.flipCell(3,10)
			env1.flipCell(3,11)
			env1.flipCell(5,1)
			env1.flipCell(5,2)
			env1.flipCell(5,3)
			env1.flipCell(5,6)
			env1.flipCell(5,7)
			env1.flipCell(5,9)
			env1.flipCell(5,10)
			env1.flipCell(5,13)
			env1.flipCell(5,14)
			env1.flipCell(5,15)
			env1.flipCell(6,3)
			env1.flipCell(6,5)
			env1.flipCell(6,7)
			env1.flipCell(6,9)
			env1.flipCell(6,11)
			env1.flipCell(6,13)
			env1.flipCell(7,5)
			env1.flipCell(7,6)
			env1.flipCell(7,10)
			env1.flipCell(7,11)
			env1.flipCell(9,5)
			env1.flipCell(9,6)
			env1.flipCell(9,10)
			env1.flipCell(9,11)
			env1.flipCell(10,3)
			env1.flipCell(10,5)
			env1.flipCell(10,7)
			env1.flipCell(10,9)
			env1.flipCell(10,11)
			env1.flipCell(10,13)
			env1.flipCell(11,1)
			env1.flipCell(11,2)
			env1.flipCell(11,3)
			env1.flipCell(11,6)
			env1.flipCell(11,7)
			env1.flipCell(11,9)
			env1.flipCell(11,10)
			env1.flipCell(11,13)
			env1.flipCell(11,14)
			env1.flipCell(11,15)
			env1.flipCell(13,5)
			env1.flipCell(13,6)
			env1.flipCell(13,10)
			env1.flipCell(13,11)
			env1.flipCell(14,5)
			env1.flipCell(14,11)
			env1.flipCell(15,5)
			env1.flipCell(15,11)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv1
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv2
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv3	
		it 'pentadecathalon', ->
			env1 = new Env(18,11)
			expectedEnv1 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv2 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv3 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv4 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv5 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv6 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv7 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 0 1 0 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv8 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 1 1 0 1 1 0 0 0 
			0 0 1 1 1 0 1 1 1 0 0 
			0 0 1 1 1 0 1 1 1 0 0 
			0 0 1 1 1 0 1 1 1 0 0 
			0 0 1 1 1 0 1 1 1 0 0 
			0 0 0 1 1 0 1 1 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv9 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 1 0 0 0 0 0 1 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 1 0 0 0 0 0 0 0 1 0 
			0 1 0 0 0 0 0 0 0 1 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 1 0 0 0 0 0 1 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv10 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 1 1 1 1 1 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 1 1 1 1 1 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv11 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv12 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 1 0 1 0 1 0 0 0 
			0 0 0 1 0 1 0 1 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 1 0 1 0 1 0 0 0 
			0 0 0 1 0 1 0 1 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv13 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv14 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv15 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 0 1 0 0 0 0 0 
			0 0 0 0 1 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			env1.flipCell(4,3)
			env1.flipCell(4,6)
			env1.flipCell(4,8)
			env1.flipCell(4,9)
			env1.flipCell(4,11)
			env1.flipCell(4,14)
			env1.flipCell(5,3)
			env1.flipCell(5,4)
			env1.flipCell(5,5)
			env1.flipCell(5,6)
			env1.flipCell(5,8)
			env1.flipCell(5,9)
			env1.flipCell(5,11)
			env1.flipCell(5,12)
			env1.flipCell(5,13)
			env1.flipCell(5,14)
			env1.flipCell(6,3)
			env1.flipCell(6,6)
			env1.flipCell(6,8)
			env1.flipCell(6,9)
			env1.flipCell(6,11)
			env1.flipCell(6,14)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv1
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv2
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv3
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv4
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv5
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv6
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv7
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv8
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv9
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv10
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv11
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv12
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv13
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv14
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv15
	describe 'space ships: ', ->
		it 'glider', ->
			env1 = new Env(6,6)
			expectedEnv1 = """
			0 0 0 0 0 0 
			0 0 0 0 0 0 
			0 1 0 1 0 0 
			0 0 1 1 0 0 
			0 0 1 0 0 0 
			0 0 0 0 0 0 \n
			"""
			expectedEnv2 = """
			0 0 0 0 0 0 
			0 0 0 0 0 0 
			0 0 0 1 0 0 
			0 1 0 1 0 0 
			0 0 1 1 0 0 
			0 0 0 0 0 0 \n
			"""
			expectedEnv3 = """
			0 0 0 0 0 0 
			0 0 0 0 0 0 
			0 0 1 0 0 0 
			0 0 0 1 1 0 
			0 0 1 1 0 0 
			0 0 0 0 0 0 \n
			"""
			expectedEnv4 = """
			0 0 0 0 0 0 
			0 0 0 0 0 0 
			0 0 0 1 0 0 
			0 0 0 0 1 0 
			0 0 1 1 1 0 
			0 0 0 0 0 0 \n
			"""
			env1.flipCell(1,3)
			env1.flipCell(2,1)
			env1.flipCell(2,3)
			env1.flipCell(3,2)
			env1.flipCell(3,3)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv1
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv2
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv3
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv4
		it 'light-weight space ship', ->
			env1 = new Env(7,11)
			expectedEnv1 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 0 0 0 0 0 
			0 0 1 1 0 1 1 0 0 0 0 
			0 0 1 1 1 1 0 0 0 0 0 
			0 0 0 1 1 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv2 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 1 1 1 1 0 0 0 0 
			0 0 1 0 0 0 1 0 0 0 0 
			0 0 0 0 0 0 1 0 0 0 0 
			0 0 1 0 0 1 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv3 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 1 1 0 0 0 0 0 
			0 0 0 1 1 1 1 0 0 0 0 
			0 0 0 1 1 0 1 1 0 0 0 
			0 0 0 0 0 1 1 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			expectedEnv4 = """
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 1 0 0 1 0 0 0 0 
			0 0 0 0 0 0 0 1 0 0 0 
			0 0 0 1 0 0 0 1 0 0 0 
			0 0 0 0 1 1 1 1 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 
			0 0 0 0 0 0 0 0 0 0 0 \n
			"""
			env1.flipCell(1,1)
			env1.flipCell(1,3)
			env1.flipCell(2,4)
			env1.flipCell(3,4)
			env1.flipCell(4,1)
			env1.flipCell(4,4)
			env1.flipCell(5,2)
			env1.flipCell(5,3)
			env1.flipCell(5,4)
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv1
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv2
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv3
			env1.nextGeneration()
			expect(env1.toString()).toEqual expectedEnv4

describe 'neighborCount should return correct number of neighbors ', ->
	env1 = {}
	beforeEach ->
		env1 = new Env(3,3)
	it 'top-left corner cell', ->
		env1.flipCell(0,1)
		env1.flipCell(1,1)
		env1.flipCell(1,0)
		expect(env1.neighborCount(0,0)).toEqual 3
	it 'top-right corner cell', ->
		env1.flipCell(0,1)
		env1.flipCell(1,1)
		env1.flipCell(1,0)
		expect(env1.neighborCount(2,0)).toEqual 2
	it 'bottom-right corner cell', ->
		env1.flipCell(1,1)
		expect(env1.neighborCount(2,2)).toEqual 1
	it 'bottom-left corner cell', ->
		env1.flipCell(0,1)
		env1.flipCell(1,2)
		expect(env1.neighborCount(0,2)).toEqual 2
		env2 = {}
		env2 = new Env(3,3)
		env2.flipCell(1,1)
		env2.flipCell(0,2)
		expect(env2.neighborCount(0,2)).toEqual 1
	it 'doesnt include itself as a neighbor', ->
		env1.flipCell(0,0)
		env1.flipCell(0,1)
		env1.flipCell(1,1)
		env1.flipCell(1,0)
		expect(env1.neighborCount(0,0)).toEqual 3
	it 'center cell', ->
		env1.flipCell(0,0)
		env1.flipCell(0,1)
		env1.flipCell(0,2)
		env1.flipCell(1,0)
		env1.flipCell(1,1)
		env1.flipCell(1,2)
		env1.flipCell(2,0)
		env1.flipCell(2,1)
		env1.flipCell(2,2)
		expect(env1.neighborCount(1,1)).toEqual 8
	it 'left edge cell', ->
		env1.flipCell(0,0)
		env1.flipCell(1,0)
		env1.flipCell(1,1)
		env1.flipCell(0,2)
		env1.flipCell(1,2)
		expect(env1.neighborCount(0,1)).toEqual 5
	it 'top edge cell', ->
		env1.flipCell(0,0)
		env1.flipCell(0,1)
		env1.flipCell(1,1)
		env1.flipCell(2,0)
		env1.flipCell(2,1)
		env1.flipCell(1,0)
		expect(env1.neighborCount(1,0)).toEqual 5
	it 'bottom edge cell', ->
		env1.flipCell(0,2)
		env1.flipCell(0,1)
		env1.flipCell(1,1)
		env1.flipCell(2,1)
		env1.flipCell(2,2)
		env1.flipCell(1,2)
		expect(env1.neighborCount(1,2)).toEqual 5
	it 'right edge cell', ->
		env1.flipCell(2,0)
		env1.flipCell(1,0)
		env1.flipCell(1,1)
		env1.flipCell(1,2)
		env1.flipCell(2,2)
		env1.flipCell(2,1)
		expect(env1.neighborCount(2,1)).toEqual 5
