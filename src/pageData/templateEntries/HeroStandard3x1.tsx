import React from 'react';
import Link from '../../router/Link';
import Carousel from '../../shared/components/Caurosel';
import { Item, List } from '../models/pageEntry';
import './HeroStandard3x1.css';

class HeroStandard3x1 extends React.PureComponent<List> {
  render() {
    return (
      <div>
        <h1>
          <Link to={this.props.path}>
            {this.props.title} <small>{this.props.id}</small>
          </Link>
        </h1>
        <Carousel className="swiper">
          {this.renderList(this.props.items)}
        </Carousel>
      </div>
    );
  }

  private renderList(items: Item[]): React.ReactNodeArray {
    return (
      items &&
      items.map(item => (
        <div
          className="swiper__item"
          key={item.id}
          style={this.setImage(item)}
        />
      ))
    );
  }

  private setImage = (item: Item) => ({
    backgroundImage: `url("${item.images.hero3x1}")`
  });
}

export default HeroStandard3x1;
