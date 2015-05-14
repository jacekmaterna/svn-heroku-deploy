/*exported should*/
var exec = require('child_process').execSync;
var should = require('should');
var fs = require('fs');

describe('index', function () {
  var baseCommand, deployObject;
  beforeEach(function (done) {
    baseCommand = 'node index ';
    deployObject = {
      svnPath: 'https://svn.com/',
      deployPath: 'https://github.com',
      svnUser: 'test',
      svnPassword: 'pw',
      gitUser: 'test',
      gitPassword: 'pw'
    };
    fs.writeFile('./good.json', JSON.stringify(deployObject), function (err) {
      should(err).equal(null);
      done();
    });
  });

  it('should throw an error if a deploy.json file is not present in the root directory', function (done) {

    exec
      .bind(null, baseCommand)
      .should.throw(/Please create a deploy\.json/g);

    done();
  });

  it('should throw an error if the json path provided does not exist', function (done) {
    exec
      .bind(null, baseCommand + ' ./deploy.json')
      .should.throw(/Please create a deploy\.json/g);

    done();
  });

  it('should throw an error if the json provided is invalid by syntax', function (done) {
    fs.writeFile('./syntaxError.json', 'test', function (err) {
      should(err).equal(null);

      exec
        .bind(null, baseCommand + './syntaxError.json')
        .should.throw(/Deploy JSON invalid/g);

      fs.unlink('./syntaxError.json', function (err) {
        should(err).equal(null);
        done();
      });
    });
  });

  it('should throw an error if the json provided is invalid by content', function (done) {
    fs.writeFile('./bad.json', '"test"', function (err) {
      should(err).equal(null);

      exec
        .bind(null, baseCommand + './bad.json')
        .should.throw(/Deploy JSON invalid/g);

      fs.unlink('./bad.json', function (err) {
        should(err).equal(null);
        done();
      });
    });
  });

  it('should throw an error if the svn path | deploy path | svn credentials | git credentials provided in json is missing', function (done) {
    fs.writeFile('./noInfo.json', JSON.stringify({}), function (err) {
      should(err).equal(null);

      exec
        .bind(null, baseCommand + './noInfo.json')
        .should.throw(/\[Missing svnPath\]\[Missing deployPath\]\[Missing svnUser\]\[Missing svnPassword\]\[Missing gitUser\]\[Missing gitPassword\]/g);

      fs.unlink('./noInfo.json', function () {
        should(err).equal(null);
        done();
      });
    });
  });

});
