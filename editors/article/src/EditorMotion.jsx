import classNames from 'classnames';
import PropTypes from 'prop-types';

import React, { useState } from 'react'
import useMeasure from 'react-use-measure'
import { useSpring, animated } from '@react-spring/web'

import styles from './motion.module.scss';

const propTypes = {
    body: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    body: null,
    className: null,
};

const EditorMotion = ({ body, className }) => {
    
    console.log('EditorMotion')

    const [open, toggle] = useState(false)
    const [ref, { width }] = useMeasure()
    const props = useSpring({ width: open ? width : 0 })

    return (
        <div className={styles.container}>
            <div ref={ref} className={styles.main} onClick={() => toggle(!open)}>
                <animated.div className={styles.fill} style={props} />
                <animated.div className={styles.content}>{props.width.to(x => x.toFixed(0))}</animated.div>
            </div>
        </div>
    )

};

EditorMotion.propTypes = propTypes;
EditorMotion.defaultProps = defaultProps;

export default EditorMotion;
