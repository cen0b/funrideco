export default defineComponent(({ name, template, schema }) => {
	name('furnideco:attributes')
	schema({
		description: 'Sets the general properties of the block.',
		type: 'object',
		properties: {
			map_color: {
				description: 'Material name or hex color to use for the map color.',
				anyOf: [
					{
						enum: [ 'oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak', 'crimson', 'warped' ]
					},
					{
						type: 'string'
					}
				]
			},
			loot_table: {
				description: 'Loot table path to use.',
				type: 'string'
			},
			strength: {
				description: 'Sets hardness & resistance.',
				type: 'array',
				minItems: 2,
				maxItems: 2,
				items: { type: 'number' }
			},
			flameable: {
				description: 'Sets how resistant the block to fire is.',
				type: 'array',
				minItems: 2,
				maxItems: 2,
				items: { type: 'number' }
			},
			solidness: {
				description: 'Specifies whether the block is solid or not.',
				type: 'number',
				maximum: 1
			},
			geometry: {
				description: 'Defines the geometry to use.',
				type: 'string'
			},
			collision: {
				description: 'Sets the collision of the block.',
				type: 'object',
				properties: {
					pick: {
						description: 'The pick collision. Disabled if set to false.',
						anyOf: [
							{
								type: 'array',
								minItems: 6,
								maxItems: 6,
								items: { type: 'number' }
							},
							{
								enum: [ false ]
							}
						]
					},
					entity: {
						description: 'The entity collision. Disabled if set to false.',
						anyOf: [
							{
								type: 'array',
								minItems: 6,
								maxItems: 6,
								items: { type: 'number' }
							},
							{
								enum: [ false ]
							}
						]
					}
				}
			}
		}
	})

	template(({ map_color, loot_table = false, strength = [1, 1], flameable = false, solidness, geometry, collision = {} }, { create, identifier }) => {

		// List of pre-set map colors
		const mapColors = new Map([
			[ 'oak', '#b8945f' ],
			[ 'spruce', '#82613a' ],
			[ 'birch', '#d7c185' ],
			[ 'jungle', '#b88764' ],
			[ 'acacia', '#ba6337' ],
			[ 'dark_oak', '#4f3218' ],
			[ 'crimson', '#7e3a56' ],
			[ 'warped', '#398382' ]
		])

		create(
			{
				'minecraft:display_name': identifier.split(':')[1],
				'minecraft:creative_category': {
					category: 'Construction',
					group: 'itemGroup.name.Construction'
				},
				'minecraft:map_color': (mapColors.has(map_color) ? mapColors.get(map_color) : map_color),
				...(loot_table && {
					'minecraft:loot': `loot_tables/${loot_table}.loot.json`
				}),
				'minecraft:destroy_time': strength[0],
				'minecraft:explosion_resistance': strength[1],
				'minecraft:block_light_absorption': solidness,
				'minecraft:breathability': (solidness > 0 ? 'solid' : 'air'),
				...(flameable && {
					'minecraft:flammable': {
						flame_odds: flameable[0],
						burn_odds: flameable[1]
					}
				}),
				...(geometry && {
					'minecraft:geometry': `geometry.${geometry}`
				}),
				...(collision.pick && {
					'minecraft:pick_collision': (collision.pick === false ? false : {
						origin: collision.pick.slice(0, 3),
						size: collision.pick.slice(3, 6)
					})
				}),
				...(collision.entity && {
					'minecraft:entity_collision': (collision.entity === false ? false : {
						origin: collision.entity.slice(0, 3),
						size: collision.entity.slice(3, 6)
					})
				})
			},
			'minecraft:block/components'
		)
	})
})
