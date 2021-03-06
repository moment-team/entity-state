/* eslint-disable max-len */
import EntityState from './EntityState';

const initialState = {
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

const someData = {
  id: 123,
  name: 'The name',
  company: {
    id: 234,
    name: 'The company',
    location: 'The place'
  }
};

const stateWithSomeData = {
  ...initialState,
  loadedAt: '2019-01-01T10:30:59',
  error: new Error('Something went wrong here!'),
  data: { ...someData }
};

const structureWithState = {
  hello: 'there',
  foo: 'BAR',
  something: stateWithSomeData
};

// EntityState.initialize = (source, sourcePath)

describe('\nEntityState.initialize()', () => {

  describe('without source', () => {
    it('should return initial state structure', () => {
      expect(EntityState.initialize()).toEqual(initialState);
    });
  });

  describe('with source', () => {
    it('should return initial state structure', () => {
      expect(EntityState.initialize({
        bar: 'BAR!',
        foo: { bar: 'bar' }
      })).toEqual(initialState);
    });
  });

  describe('with source & path', () => {
    it('should return source with path containing initial state structure', () => {
      expect(EntityState.initialize({
        bar: 'BAR!',
        foo: { bar: 'bar' }
      }, 'foo'))
        .toEqual({
          bar: 'BAR!',
          foo: initialState
        });
    });
  });
});


// EntityState.load = (data, source, sourcePath)

describe('\nEntityState.load', () => {

  describe('without source', () => {
    it('returns initial state with given data', () => {
      expect(EntityState.load(someData))
        .toEqual({
          ...initialState,
          data: someData
        });
    });
  });

  describe('with source', () => {
    it('returns initial state with given data, but keeps local changes from source', () => {
      expect(EntityState.load(someData, {
        error: new Error('Something went wrong.'),
        pathChange: {
          foo: 'bar'
        }
      }))
        .toEqual({
          ...initialState,
          error: undefined,
          pathChange: {
            foo: 'bar'
          },
          data: someData
        });
    });
  });

  describe('with source & sourcePath', () => {
    it('returns new source, where sourcePath contains initial state with given data, but keeps local changes from existing sourcePath data', () => {
      expect(EntityState.load(someData, {
        foo: { bar: 'BAR' },
        something: {
          error: new Error('Something went wrong.'),
          pathChange: {
            write: 'this'
          }
        }
      }, 'something'))
        .toEqual({
          foo: { bar: 'BAR' },
          something: {
            ...initialState,
            error: undefined,
            pathChange: {
              write: 'this'
            },
            data: someData
          }
        });
    });
  });

});


describe('\nEntityState.set', () => {

  describe('without source', () => {
    it('should return an initial state with data containing only the given value at path', () => {
      const res = EntityState.set('email', 'set1@example.com');

      expect(res).toEqual({
        ...initialState,
        data: {
          email: 'set1@example.com'
        }
      });
    });
  });

  describe('deep set without source', () => {
    it('should return an initial state with data containing only the given value at path', () => {
      const res = EntityState.set('company.location', 'The other place');

      expect(res).toEqual({
        ...initialState,
        data: {
          company: {
            location: 'The other place'
          }
        }
      });
    });
  });

  describe('with source', () => {
    it('should return the given source with same data but given path set to given value', () => {
      const res = EntityState.set('email', 'set2@example.com', stateWithSomeData);

      expect(res).toEqual({
        ...stateWithSomeData,
        data: {
          ...someData,
          email: 'set2@example.com'
        }
      });
    });
  });

  describe('deep set with source', () => {
    it('should return the given source with same data but given path set to given value', () => {
      const res = EntityState.set('company.location', 'The other place', stateWithSomeData);

      expect(res).toEqual({
        //...initialState,
        ...stateWithSomeData,
        data: {
          ...someData,
          company: {
            ...someData.company,
            location: 'The other place'
          }
        }
      });
    });
  });

  describe('with source & sourcePath', () => {
    it('should return a new source, where sourcePath contains same state but with given data path set to given value', () => {
      const res = EntityState.set('email', 'set3@example.com', { hello: 'there', fooBar: stateWithSomeData }, 'fooBar');

      expect(res).toEqual({
        hello: 'there',
        fooBar: {
          ...stateWithSomeData,
          data: {
            ...someData,
            email: 'set3@example.com'
          }
        }
      });
    });
  });

  describe('deep set with source & sourcePath', () => {
    it('should return a new source, where sourcePath contains same state but with given data path set to given value', () => {
      // const res = EntityState.set('company.location', 'The other place', { hello: 'there', fooBar: stateWithSomeData }, 'fooBar');
      const res = EntityState.set('company.location', 'The other place', structureWithState, 'something');

      expect(res).toEqual({
        ...structureWithState,
        something: {
          ...structureWithState.something,
          data: {
            ...someData,
            company: {
              ...someData.company,
              location: 'The other place'
            }
          }
        }
      });
    });
  });

});


describe('\nEntityState.stage', () => {

  describe('without source', () => {
    it('should return an initial state with no data and [path] staged for change to [value]', () => {
      const res = EntityState.stage('email', 'stage1@example.com');

      expect(res).toEqual({
        ...initialState,
        pathChange: {
          email: 'stage1@example.com'
        }
      });
    });
  });

  describe('stage deep path without source', () => {
    it('should return an initial state with no data and [path] staged for change to [value]', () => {
      const res = EntityState.stage('company.location', 'Somewhere else');

      expect(res).toEqual({
        ...initialState,
        pathChange: {
          'company.location': 'Somewhere else'
        }
      });
    });
  });

  describe('with source', () => {
    it('should return the [source] with unchanged data and [path] staged for change to [value]', () => {
      const res = EntityState.stage('email', 'stage2@example.com', stateWithSomeData);

      expect(res).toEqual({
        ...stateWithSomeData,
        pathChange: {
          email: 'stage2@example.com'
        }
      });
    });
  });

  describe('stage deep path ith source', () => {
    it('should return the [source] with unchanged data and [path] staged for change to [value]', () => {
      const res = EntityState.stage('company.location', 'Somewhere else', stateWithSomeData);

      expect(res).toEqual({
        ...stateWithSomeData,
        pathChange: {
          'company.location': 'Somewhere else'
        },
        pathInitial: {
          'company.location': someData.company.location
        }
      });
    });
  });

  describe('with source & sourcePath', () => {
    it('should return a new [source] with [sourcePath] containing a state with unchanged data and [path] staged for change to [value]', () => {
      const res = EntityState.stage('email', 'stage3@example.com', structureWithState, 'something');

      expect(res).toEqual({
        ...structureWithState,
        something: {
          ...structureWithState.something,
          pathChange: {
            email: 'stage3@example.com'
          }
        }
      });
    });
  });

  describe('stage deep path with source & sourcePath', () => {
    it('should return a new [source] with [sourcePath] containing a state with unchanged data and [path] staged for change to [value]', () => {
      const res = EntityState.stage('company.location', 'Somewhere else', structureWithState, 'something');

      expect(res).toEqual({
        ...structureWithState,
        something: {
          ...structureWithState.something,
          pathChange: {
            'company.location': 'Somewhere else'
          },
          pathInitial: {
            'company.location': someData.company.location
          }
        }
      });
    });
  });

});


describe('\nEntityState.clear', () => {

  describe('without source', () => {
    it('should return undefined', () => {
      const res = EntityState.clear();
      expect(res).toEqual(undefined);
    });
  });

  describe('with source', () => {
    it('should return undefined', () => {
      const res = EntityState.clear(someData);
      expect(res).toEqual(undefined);
    });
  });

  describe('with source & sourcePath', () => {
    it('should return undefined', () => {
      const res = EntityState.clear(structureWithState, 'something');
      expect(res).toEqual({
        ...structureWithState,
        something: undefined
      });
    });
  });

});

// CLEAN

test('EntityState.cleanPath', () => {
  const actual = EntityState.cleanPath('foo', {
    data: {
      foo: 'Foo!!',
      bar: 'Bar!!'
    },
    pathChange: {
      foo: 'fooooooo',
      bar: 'baaaaaar'
    },
    pathError: {
      foo: { message: 'Wrong foo' },
      bar: { message: 'Wrong bar' }
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
      bar: { message: 'Wrong bar' }
    },
    pathUpdating: {
      foo: true,
      bar: true
    }
  });
});

describe('EntityState.indent', () => {
  it('should indent limited state sets', () => {
    expect(
      EntityState.indent('bar', {
        pathMode: { foo: 'deleting' },
        pathUpdating: { foo: true }
      })
    ).toEqual({
      pathMode: { 'bar.foo': 'deleting' },
      pathUpdating: { 'bar.foo': true }
    });
  });

  it('should indent all path based meta data', () => {
    expect(
      EntityState.indent('blah', {
        mode: 'edit',
        data: { bar: { foo: 'bar' } },
        pathMode: { foo: 'deleting' },
        pathChange: { some: 'Something' },
        pathUpdating: { foo: true }
      })
    ).toEqual({
      mode: 'edit',
      data: { bar: { foo: 'bar' }},
      pathMode: { 'blah.foo': 'deleting' },
      pathChange: { 'blah.some': 'Something' },
      pathUpdating: { 'blah.foo': true }
    });
  });
});


describe('\nEntityState.dataWithChanges', () => {
  it('should return data unchanged for state without any pathChange', () => {
    const actual = EntityState.dataWithChanges({
      data: {
        foo: 'Foo!!',
        bar: 'Bar??'
      }
    });
    const expected = {
      foo: 'Foo!!',
      bar: 'Bar??'
    };
    expect(actual).toEqual(expected);
  });

  it('should merge data and pathChange correctly', () => {
    const actual = EntityState.dataWithChanges({
      data: {
        foo: 'Foo!!',
        bar: 'Bar??'
      },
      pathChange: {
        foo: 'foooooooo'
      }
    });
    const expected = {
      foo: 'foooooooo',
      bar: 'Bar??'
    };
    expect(actual).toEqual(expected);
  });

  it('should ignore properties set to undefined in pathChange', () => {
    const actual = EntityState.dataWithChanges({
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
    const expected = {
      //foo: 'Foo!!',
      bar: 'BAAAAR',
      foobar: 'Foo Bar'
    };
    expect(actual).toEqual(expected);
  });

});
