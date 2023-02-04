import { BlockMove } from '../node_modules/blockly/core/events/events_block_move.js'
import {listBlocksInModBlock, centerAndSelectBlockByID, getRuleName} from '../lib/helper'

export function startListRulesChangeListner(){
    window.mainWorkspace.addChangeListener(function (event: BlockMove) {
        if (event.type == window.Blockly.Events.BLOCK_MOVE) {
            const block = window.mainWorkspace.getBlockById(event.blockId)
            if (block && block.type === "ruleBlock"){
                listRules()
            }  
        }
    });
} 

export function listRules() {
    const rulesListContaier = $('.collapsedRuleInnerContainer')
    if (rulesListContaier.length) {
        listBlocksInModBlock().then(blocks => {
            rulesListContaier.children('.collapsedRule').remove()
            blocks.forEach((block, index) => {
            const ruleCollapsedBlock = $('<div>', { 
                class: 'collapsedRule',
                "data-block-id": block.id,
            }).append($('<div>').text(index + 1)).append($('<div>').text(getRuleName(block)))
            
            ruleCollapsedBlock.on('click touch',function(){
                centerAndSelectBlockByID(this.getAttribute("data-block-id"))
            })

            ruleCollapsedBlock.appendTo(rulesListContaier)
        })})
    }
}