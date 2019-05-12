import React from 'react';
import { Item, List } from '../../pageData/models/pageEntry';
import Link from '../../router/Link';
import Carousel from '../../shared/components/Caurosel';
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
        <Carousel className="swiper" useRx={true} interval={2000}>
          {this.renderCarouselItems(this.props.items)}
        </Carousel>
      </div>
    );
  }

  private renderCarouselItems(items: Item[]): React.ReactNodeArray {
    return items.map(item => (
      <div className="swiper__item" key={item.id} style={this.setImage(item)}>
        <div className="item__title">
          <Link to={item.path}>{item.title}</Link>
          <p>{item.tagline}</p>
        </div>
      </div>
    ));
  }

  private setImage = (item: Item) => ({
    backgroundImage: `url("${item.images.hero3x1}")`
  });
}

export default HeroStandard3x1;
