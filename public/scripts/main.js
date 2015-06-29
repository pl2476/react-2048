
var GridContainer=React.createClass({
    render:function(){
      var grid=this.props.gameData.map(function(row){
          return <div className="grid-row">{row.map(function(){ return <div className="grid-cell"></div>})}</div>
      })
      return(
            <div className="grid-container">
              {grid}
            </div>          
      )
    }
})

var NumCell=React.createClass({
    componentDidUpdate :function(){
      var gameData=this.props.gameData;
      var $elmt=$(React.findDOMNode(this.refs.numCell));
        $elmt.animate({
          top:this.numCellTop(gameData.row,gameData.column),
          left:this.numCellLeft(gameData.row,gameData.column)
        }, 300);
    },
    numCellTop:function(column,row){
      var top=getPosTop(column,row)
      return top;
    },
    numCellLeft:function(column,row){
      var left=getPosLeft(column,row)
      return left;
    },
    numCellClass:function(){
      var gameData=this.props.gameData;
      var classArray=['num-cell'];

      var cellValue=gameData.value;
      classArray.push('cell-color-'+cellValue)

      if(gameData.isNew){
        classArray.push('cell-new')
      }

      if(gameData.isMerged){
        classArray.push('cell-merged')
      }

      return  classArray.join(" ");
    },
    render:function(){
      var gameData=this.props.gameData;
      var row=gameData.oldRow!=-1?gameData.oldRow:gameData.row;
      var column=gameData.oldColumn!=-1?gameData.oldColumn:gameData.column;
      
         var numStyle={top: this.numCellTop(row,column),left:this.numCellLeft(row,column)};
          console.log(numStyle)
      
      return(
          <div className={this.numCellClass()} ref='numCell' style={numStyle}>{this.props.gameData.value}</div>
      )
    }
})

var NumContainer=React.createClass({
    render:function(){
        var nums=[];
        this.props.gd.map(function(row,keyRow){
            row.map(function(el,keyCol){
                var keymark = keyCol+'-'+keyRow+'-'+this.props.gd[keyRow][keyCol].value;
                if(this.props.gd[keyRow][keyCol].value > 0){
                    nums.push(<NumCell gameData={this.props.gd[keyRow][keyCol]} />);
                }
            }.bind(this))
        }.bind(this));
        return(
          <div className='num-container'>
            {nums}
          </div>
        )
    }
})


var React2048=React.createClass({
    getInitialState:function(){
        return {gameData:new Game};
    },
    handleKeyDown:function(event){
       event.preventDefault;
       if (event.keyCode >= 37 && event.keyCode <= 40) {
  
            var direction = event.keyCode - 37;
            var gd = this.state.gameData.move(direction)
            this.setState({gameData: gd});
          }

    },
    componentDidMount: function () {
        window.addEventListener('keydown', this.handleKeyDown);
    },
    componentWillUnmount: function () {
        window.removeEventListener('keydown', this.handleKeyDown);
    },
    render:function(){
        return(
            <div className='container'>
                <GridContainer gameData={this.state.gameData.gd} />
                <NumContainer gd={this.state.gameData.gd} />
            </div>
        )
    }
})

React.render(<React2048 />, document.getElementById('container'));
