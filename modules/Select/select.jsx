'use strict';


import "./select.less";

import React from "react";
import classnames from "classnames";
import Button from "../Button/button";
import Icon from "../Icon/icon";
import {formatData} from "../Utils/array";
import {addClass,removeClass,removeSiblingsClass,isClickInner} from "../Utils/dom";


class Select extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show:false,
			data:formatData(this.props.data),
			mult:this.props.mult,
			value:this.props.value,
			selectedArr:[]
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.value !== this.state.value){
			this.setState({value:nextProps.value})
		}
	}
	componentDidMount(){
		let _this = this,
			selectEle = _this.refs.select;
		document.addEventListener('click',function(e){
			e.stopPropagation();
			let currEle = e.target;
			if(!isClickInner(currEle,selectEle)){
				_this.hide();
			}
		});
	}

	show(){
		this.setState({show:true})
	}
	hide(){
		this.setState({show:false})
	}
	/**
	 * 单击 显示下拉菜单
	 */
	handleClick(){
		this.show();
	}

	/**
	 * 多选 单击已选值 删除 并移除 相应菜单项的active
	 */
	removeSelectedItem(i,e){
		e.stopPropagation();
		let selectedArr = this.state.selectedArr,
			newArr=[];
		for(let item of selectedArr){
			if(parseInt(item.key) !== i){
				newArr.push(item)
			}else{
				let selectEMenu = e.currentTarget.parentNode.nextSibling;
				removeClass(selectEMenu.getElementsByTagName('li')[i],'active');
			}
		}
		this.setState({selectedArr:newArr});
	}

	/**
	 * 点击下拉菜单项 关闭 菜单
	 */
	handleSelect(i,e){
		let text = e.currentTarget.innerText;
		let selectMenu = e.currentTarget.parentElement;
		let selectedArr = this.state.selectedArr;
		if(this.props.readOnly){
			return
		}
		if(this.state.mult){
			selectedArr.push(
				<em key={i} className='selected_item'
					onClick={this.removeSelectedItem.bind(this,i)}
					dangerouslySetInnerHTML={{__html: text}}>
				</em>
			);
		}else{
			selectedArr.length = 0;
			selectedArr.push(text);
			removeSiblingsClass(e.currentTarget,'active');
			this.hide();
			e.stopPropagation();
		}
		this.setState({selectedArr:selectedArr});
		addClass(e.currentTarget,'active');
		if(this.props.onSelected){
			this.props.onSelected(e);
		}
	}


	render(){
		let className = classnames('select',this.props.className,this.state.show?'active':''),
			selectedArr = this.state.selectedArr;
		let selectItems = this.state.data.map(function(item,i){
			return (
				<li key={i} data-value={item.value} onClick={this.handleSelect.bind(this,i)} >
					{item.text}
				</li>
			)
		},this);

		return (
			<div ref='select' style={this.props.style} className={className} onClick={this.handleClick.bind(this)}>
				<Button className='select_btn'>
					{selectedArr.length>0 ? selectedArr : <span className="placeholder">{this.props.placeholder} </span>} <Icon icon={this.props.icon} />
				</Button>
				<ul className='select_menu'>
					{selectItems}
				</ul>
				{this.props.children}
			</div>
		)
	}
}

export {Select as default};