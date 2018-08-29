import React from 'react';
import $ from 'jquery';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import {GEO_OPTIONS, POS_KEY, API_ROOT, TOKEN_KEY, AUTH_PREFIX} from "../constance";
import { Gallery } from "./Gallery";
import { CreatePostButton} from "./CreatePostButton";
import { WrappedAroundMap} from "./AroundMap";

const RadioGroup = Radio.Group;

export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,
        loadingPost: false,
        posts: [],
        error: '',
        topic: 'around',
    }

    //componentDidMount要override react component的，所以不能写成() => {}
    componentDidMount(){
        // 马上就要load了
        this.setState({ loadingGeoLocation: true, error: ''});
        this.getGeolocation();
    }

    //看geolocation是否load出来了
    getGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({ loadingGeoLocation: false, error: 'Your browser does not support geolocation.' });
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        this.setState({ loadingGeoLocation: false, error: '' });
        console.log(position);
        const {latitude, longitude} = position.coords;
        // geo location就存到local storage去了
        localStorage.setItem(POS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
        this.loadNearbyPost();
    }

    loadNearbyPost = (location, radius) => {
        this.setState({ loadingPost: true, error: '' });
        //当我load到一个地方的时候，我需要load他周围的的post
        const { lat, lon } = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        const token = localStorage.getItem(TOKEN_KEY);
        const endPoint = this.state.topic === 'around' ? 'search' : 'cluster';
        const term = this.state.topic === 'around' ? '' : 'face';
        $.ajax({
            url: `${API_ROOT}/${endPoint}?lat=${lat}&lon=${lon}&range=${range}&term=${term}`,
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                Authorization: `${AUTH_PREFIX} ${token}`,
            }
        }).then((response) => {//显示图片
            const posts = response ? response : [];
            this.setState({ posts, loadingPost: false, error: ''});
            console.log(response);
        }, (response) => {
            console.log(response.responseText);
            this.setState({ loadingPosts: false, error: 'Failed to load posts.' })
        }).catch((e) => {
            console.log(e);
        });
    }

    onFailedLoadGeoLocation = () => {
        console.log('failed to load geo location.');
        this.setState({ loadingGeoLocation: false, error: 'failed to load geo location.'});
    }

    getPanelContent = (type) => {// handle跟post相关的
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="Loading geo location..."/>;
        } else if (this.state.loadingPosts) {
            return <spin tip="Loading posts..."/>;
        } else if (this.state.posts) {
            return type === 'image' ? this.getImagePosts() : this.getVideoPosts();
        } else {
            return <div>Found Nothing...</div>;
        }
    }

    getImagePosts = () => {
        const images = this.state.posts
            .filter((post) => post.type === 'image')
            .map((post) => {//到这里就都是image post了
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300
                }
            });
        return <Gallery images={images}/>//return gallery包装的image
    }

    getVideoPosts = () => {
        return (
            <Row gutter={32}>
                {
                 this.state.posts
                 .filter((post) => post.type === 'video')
                    .map((post) => <Col span={6} key={post.url}> <video src={post.url} controls className="video-block"/></Col>)
                }
                {/*return 散落的array, controls是让静态的图片变成动态的video*/}
            </Row>
        );
    }

    onTopicChange = (e) => {
        this.setState({ topic: e.target.value }, this.loadNearbyPost);
        //setState(, callback)
    }

    render() {
        const TabPane = Tabs.TabPane;
        const operations = <CreatePostButton loadNearbyPost={this.loadNearbyPost}/>;
        return (
            <div>
                <RadioGroup onChange={this.onTopicChange} value={this.state.topic} className="topic-radio-group">
                    <Radio value="around">Posts Around Me</Radio>
                    <Radio value="face">Faces Around The World</Radio>
                </RadioGroup>
                <Tabs tabBarExtraContent={operations} className="main-tabs">
                    <TabPane tab="Image Posts" key="1">
                        {this.getPanelContent('image')}
                    </TabPane>

                    <TabPane tab="Video Posts" key="2">
                        {this.getPanelContent('video')}
                    </TabPane>
                    <TabPane tab="Map" key="3">
                        <WrappedAroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts={this.state.posts}
                            loadNearbyPost={this.loadNearbyPost}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}