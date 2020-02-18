"use strict";

var _EntityState = _interopRequireDefault(require("./EntityState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  data: undefined,
  pathChange: {},
  pathInitial: {},
  initializedAt: undefined,
  loadedAt: undefined,
  changedAt: undefined,
  error: undefined,
  pathError: {},
  mode: undefined,
  pathMode: {},
  loading: false,
  updating: false,
  pathLoading: {},
  pathUpdating: {}
};
var someData = {
  id: 123,
  name: 'The name',
  company: {
    id: 234,
    name: 'The company',
    location: 'The place'
  }
};

var stateWithSomeData = _objectSpread({}, initialState, {
  loadedAt: '2019-01-01T10:30:59',
  error: new Error('Something went wrong here!'),
  data: _objectSpread({}, someData)
});

var structureWithState = {
  hello: 'there',
  foo: 'BAR',
  something: stateWithSomeData
}; // EntityState.initialize = (source, sourcePath)

describe('\nEntityState.initialize()', function () {
  describe('without source', function () {
    it('should return initial state structure', function () {
      expect(_EntityState["default"].initialize()).toEqual(initialState);
    });
  });
  describe('with source', function () {
    it('should return initial state structure', function () {
      expect(_EntityState["default"].initialize({
        bar: 'BAR!',
        foo: {
          bar: 'bar'
        }
      })).toEqual(initialState);
    });
  });
  describe('with source & path', function () {
    it('should return source with path containing initial state structure', function () {
      expect(_EntityState["default"].initialize({
        bar: 'BAR!',
        foo: {
          bar: 'bar'
        }
      }, 'foo')).toEqual({
        bar: 'BAR!',
        foo: initialState
      });
    });
  });
}); // EntityState.load = (data, source, sourcePath)

describe('\nEntityState.load', function () {
  describe('without source', function () {
    it('returns initial state with given data', function () {
      expect(_EntityState["default"].load(someData)).toEqual(_objectSpread({}, initialState, {
        data: someData
      }));
    });
  });
  describe('with source', function () {
    it('returns initial state with given data, but keeps local changes from source', function () {
      expect(_EntityState["default"].load(someData, {
        error: new Error('Something went wrong.'),
        pathChange: {
          foo: 'bar'
        }
      })).toEqual(_objectSpread({}, initialState, {
        error: undefined,
        pathChange: {
          foo: 'bar'
        },
        data: someData
      }));
    });
  });
  describe('with source & sourcePath', function () {
    it('returns new source, where sourcePath contains initial state with given data, but keeps local changes from existing sourcePath data', function () {
      expect(_EntityState["default"].load(someData, {
        foo: {
          bar: 'BAR'
        },
        something: {
          error: new Error('Something went wrong.'),
          pathChange: {
            write: 'this'
          }
        }
      }, 'something')).toEqual({
        foo: {
          bar: 'BAR'
        },
        something: _objectSpread({}, initialState, {
          error: undefined,
          pathChange: {
            write: 'this'
          },
          data: someData
        })
      });
    });
  });
});
describe('\nEntityState.set', function () {
  describe('without source', function () {
    it('should return an initial state with data containing only the given value at path', function () {
      var res = _EntityState["default"].set('email', 'set1@example.com');

      expect(res).toEqual(_objectSpread({}, initialState, {
        data: {
          email: 'set1@example.com'
        }
      }));
    });
  });
  describe('deep set without source', function () {
    it('should return an initial state with data containing only the given value at path', function () {
      var res = _EntityState["default"].set('company.location', 'The other place');

      expect(res).toEqual(_objectSpread({}, initialState, {
        data: {
          company: {
            location: 'The other place'
          }
        }
      }));
    });
  });
  describe('with source', function () {
    it('should return the given source with same data but given path set to given value', function () {
      var res = _EntityState["default"].set('email', 'set2@example.com', stateWithSomeData);

      expect(res).toEqual(_objectSpread({}, stateWithSomeData, {
        data: _objectSpread({}, someData, {
          email: 'set2@example.com'
        })
      }));
    });
  });
  describe('deep set with source', function () {
    it('should return the given source with same data but given path set to given value', function () {
      var res = _EntityState["default"].set('company.location', 'The other place', stateWithSomeData);

      expect(res).toEqual(_objectSpread({}, stateWithSomeData, {
        data: _objectSpread({}, someData, {
          company: _objectSpread({}, someData.company, {
            location: 'The other place'
          })
        })
      }));
    });
  });
  describe('with source & sourcePath', function () {
    it('should return a new source, where sourcePath contains same state but with given data path set to given value', function () {
      var res = _EntityState["default"].set('email', 'set3@example.com', {
        hello: 'there',
        fooBar: stateWithSomeData
      }, 'fooBar');

      expect(res).toEqual({
        hello: 'there',
        fooBar: _objectSpread({}, stateWithSomeData, {
          data: _objectSpread({}, someData, {
            email: 'set3@example.com'
          })
        })
      });
    });
  });
  describe('deep set with source & sourcePath', function () {
    it('should return a new source, where sourcePath contains same state but with given data path set to given value', function () {
      // const res = EntityState.set('company.location', 'The other place', { hello: 'there', fooBar: stateWithSomeData }, 'fooBar');
      var res = _EntityState["default"].set('company.location', 'The other place', structureWithState, 'something');

      expect(res).toEqual(_objectSpread({}, structureWithState, {
        something: _objectSpread({}, structureWithState.something, {
          data: _objectSpread({}, someData, {
            company: _objectSpread({}, someData.company, {
              location: 'The other place'
            })
          })
        })
      }));
    });
  });
});
describe('\nEntityState.stage', function () {
  describe('without source', function () {
    it('should return an initial state with no data and [path] staged for change to [value]', function () {
      var res = _EntityState["default"].stage('email', 'stage1@example.com');

      expect(res).toEqual(_objectSpread({}, initialState, {
        pathChange: {
          email: 'stage1@example.com'
        }
      }));
    });
  });
  describe('stage deep path without source', function () {
    it('should return an initial state with no data and [path] staged for change to [value]', function () {
      var res = _EntityState["default"].stage('company.location', 'Somewhere else');

      expect(res).toEqual(_objectSpread({}, initialState, {
        pathChange: {
          'company.location': 'Somewhere else'
        }
      }));
    });
  });
  describe('with source', function () {
    it('should return the [source] with unchanged data and [path] staged for change to [value]', function () {
      var res = _EntityState["default"].stage('email', 'stage2@example.com', stateWithSomeData);

      expect(res).toEqual(_objectSpread({}, stateWithSomeData, {
        pathChange: {
          email: 'stage2@example.com'
        }
      }));
    });
  });
  describe('stage deep path ith source', function () {
    it('should return the [source] with unchanged data and [path] staged for change to [value]', function () {
      var res = _EntityState["default"].stage('company.location', 'Somewhere else', stateWithSomeData);

      expect(res).toEqual(_objectSpread({}, stateWithSomeData, {
        pathChange: {
          'company.location': 'Somewhere else'
        },
        pathInitial: {
          'company.location': someData.company.location
        }
      }));
    });
  });
  describe('with source & sourcePath', function () {
    it('should return a new [source] with [sourcePath] containing a state with unchanged data and [path] staged for change to [value]', function () {
      var res = _EntityState["default"].stage('email', 'stage3@example.com', structureWithState, 'something');

      expect(res).toEqual(_objectSpread({}, structureWithState, {
        something: _objectSpread({}, structureWithState.something, {
          pathChange: {
            email: 'stage3@example.com'
          }
        })
      }));
    });
  });
  describe('stage deep path with source & sourcePath', function () {
    it('should return a new [source] with [sourcePath] containing a state with unchanged data and [path] staged for change to [value]', function () {
      var res = _EntityState["default"].stage('company.location', 'Somewhere else', structureWithState, 'something');

      expect(res).toEqual(_objectSpread({}, structureWithState, {
        something: _objectSpread({}, structureWithState.something, {
          pathChange: {
            'company.location': 'Somewhere else'
          },
          pathInitial: {
            'company.location': someData.company.location
          }
        })
      }));
    });
  });
});
describe('\nEntityState.clear', function () {
  describe('without source', function () {
    it('should return undefined', function () {
      var res = _EntityState["default"].clear();

      expect(res).toEqual(undefined);
    });
  });
  describe('with source', function () {
    it('should return undefined', function () {
      var res = _EntityState["default"].clear(someData);

      expect(res).toEqual(undefined);
    });
  });
  describe('with source & sourcePath', function () {
    it('should return undefined', function () {
      var res = _EntityState["default"].clear(structureWithState, 'something');

      expect(res).toEqual(_objectSpread({}, structureWithState, {
        something: undefined
      }));
    });
  });
}); // CLEAN

test('EntityState.cleanPath', function () {
  var actual = _EntityState["default"].cleanPath('foo', {
    data: {
      foo: 'Foo!!',
      bar: 'Bar!!'
    },
    pathChange: {
      foo: 'fooooooo',
      bar: 'baaaaaar'
    },
    pathError: {
      foo: {
        message: 'Wrong foo'
      },
      bar: {
        message: 'Wrong bar'
      }
    },
    pathUpdating: {
      foo: true,
      bar: true
    }
  });

  expect(actual).toEqual({
    data: {
      foo: 'Foo!!',
      bar: 'Bar!!'
    },
    pathChange: {
      bar: 'baaaaaar'
    },
    pathError: {
      bar: {
        message: 'Wrong bar'
      }
    },
    pathUpdating: {
      foo: true,
      bar: true
    }
  });
});
describe('EntityState.indent', function () {
  it('should indent limited state sets', function () {
    expect(_EntityState["default"].indent('bar', {
      pathMode: {
        foo: 'deleting'
      },
      pathUpdating: {
        foo: true
      }
    })).toEqual({
      pathMode: {
        'bar.foo': 'deleting'
      },
      pathUpdating: {
        'bar.foo': true
      }
    });
  });
  it('should indent all path based meta data', function () {
    expect(_EntityState["default"].indent('blah', {
      mode: 'edit',
      data: {
        bar: {
          foo: 'bar'
        }
      },
      pathMode: {
        foo: 'deleting'
      },
      pathChange: {
        some: 'Something'
      },
      pathUpdating: {
        foo: true
      }
    })).toEqual({
      mode: 'edit',
      data: {
        bar: {
          foo: 'bar'
        }
      },
      pathMode: {
        'blah.foo': 'deleting'
      },
      pathChange: {
        'blah.some': 'Something'
      },
      pathUpdating: {
        'blah.foo': true
      }
    });
  });
});
describe('\nEntityState.dataWithChanges', function () {
  it('should return data unchanged for state without any pathChange', function () {
    var actual = _EntityState["default"].dataWithChanges({
      data: {
        foo: 'Foo!!',
        bar: 'Bar??'
      }
    });

    var expected = {
      foo: 'Foo!!',
      bar: 'Bar??'
    };
    expect(actual).toEqual(expected);
  });
  it('should merge data and pathChange correctly', function () {
    var actual = _EntityState["default"].dataWithChanges({
      data: {
        foo: 'Foo!!',
        bar: 'Bar??'
      },
      pathChange: {
        foo: 'foooooooo'
      }
    });

    var expected = {
      foo: 'foooooooo',
      bar: 'Bar??'
    };
    expect(actual).toEqual(expected);
  });
  it('should ignore properties set to undefined in pathChange', function () {
    var actual = _EntityState["default"].dataWithChanges({
      data: {
        foo: 'Foo!!',
        bar: 'Bar??'
      },
      pathChange: {
        foo: undefined,
        bar: 'BAAAAR',
        foobar: 'Foo Bar'
      }
    });

    var expected = {
      //foo: 'Foo!!',
      bar: 'BAAAAR',
      foobar: 'Foo Bar'
    };
    expect(actual).toEqual(expected);
  });
});