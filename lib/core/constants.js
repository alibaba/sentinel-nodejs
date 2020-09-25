/*
 * Copyright 1999-2018 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const EntranceNode = require('./node/entrance');
const ResourceNode = require('./node/resource');

/**
 * @author mark.ck
 */

const Constants = {

  SENTINEL_VERSION: require('../../package').version || '0.1.0',

  MAX_CONTEXT_NAME_SIZE: 2000,
  MAX_SLOT_CHAIN_SIZE: 6000,

  ROOT_ID: 'machine-root',

  // 多进程模式下，node 的不同进程，默认处于不同context
  CONTEXT_DEFAULT_NAME: 'sentinel_default_context_' + process.pid,

  /**
   * A virtual resource identifier for total inbound statistics.
   */
  TOTAL_IN_RESOURCE_NAME: '__total_inbound_traffic__',

  /**
   * Global ROOT statistic node that represents the universal parent node.
   */
  ROOT: new EntranceNode('machine-root'),

  /**
   * Global statistic node for inbound traffic.
   */
  INBOUND_STAT_NODE: new ResourceNode(),

  /**
   * The global switch for Sentinel.
   */
  ON: true,

  /**
   * The flag for sentinel async_hooks type
   */
  AsyncTypeFlag: 'Sentinel',
};

module.exports = Constants;
