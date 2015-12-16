Cell = require '../../server/cell.js'

describe 'constructor should ', ->
	cell = {}
	beforeEach ->
		cell = new Cell(4,3)
	it 'encapsulate instance vars', ->
		expect(cell._x).toBeUndefined()
	it 'keeps track of x and y', ->
		expect(cell.x).toEqual 4
		expect(cell.y).toEqual 3
	it 'sets alive property to 0 by default', ->
		expect(cell.alive).toEqual 0
	it 'creates id of format x-y', ->
		expect(cell.id).toEqual '4-3'

describe 'toString should', ->
	it 'return string in correct format', ->
		cell = new Cell(3,3)
		expectedString = "x:3 y:3 alive:0 color:#eeeeee"
		expect(cell.toString()).toEqual expectedString
		expect(1).toBe 1

describe 'cellEquals should', ->
	it 'return true when two cells have the same internal state', ->
		cell1 = new Cell(3,3)
		cell2 = new Cell(3,3)
		expect(cell1.cellEquals(cell2)).toBeTruthy()
	it 'return false when two cells have different internal state', ->
		cell1 = new Cell(3,3)
		cell2 = new Cell(4,3)
		expect(cell1.cellEquals(cell2)).toBeFalsy()
		cell1 = new Cell(3,3)
		cell2 = new Cell(3,4)
		expect(cell1.cellEquals(cell2)).toBeFalsy()
		cell1 = new Cell(3,3)
		cell2 = new Cell(3,3)
		cell2.toggleLife()
		expect(cell1.cellEquals(cell2)).toBeFalsy()

describe 'toggleLife should ', ->
	it 'toggle life', ->
		cell = new Cell(3,3)
		expect(cell.alive).toBe 0
		cell.toggleLife()
		expect(cell.alive).toBe 1
		cell.toggleLife()
		expect(cell.alive).toBe 0

describe 'clone should ', ->
	cell = {}
	beforeEach ->
		cell = new Cell(4,3)
	it 'return copy', ->
		expect(cell.cellEquals(cell.clone())).toBeTruthy()
	it 'create copy with separate instance varibles', ->
		copy = cell.clone()
		cell.toggleLife()
		expect(cell.alive).not.toEqual copy.alive