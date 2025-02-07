import React from 'react';
import { useDrop } from 'react-dnd';
import { X } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

export function DropZone({ label, acceptedTypes, fields, onDrop, onRemove, onReorder }) {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'FIELD',
		drop: (item, monitor) => {
			const dropResult = monitor.getDropResult();
			if (dropResult && dropResult.index !== undefined) {
				// 如果是重新排序
				if (onReorder) {
					onReorder(item.field, dropResult.index)
				}
			} else {
				// 如果是新的拖拽
				onDrop(item.field, item.fieldType)
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}));


	const handleDragStart = (e, field, index) => {
		e.dataTransfer.setData('text/plain', JSON.stringify({ field, index }));
	};

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (e, index) => {
		e.preventDefault();
		const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
		if (droppedData && onReorder) {
			onReorder(droppedData.field, index, droppedData.index)
		}
	}
	return (
		<div
			ref={drop}
			className={`p-2 rounded-lg border-2 border-dashed
				${isOver ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'}`}
		>
			<div className="flex items-center min-h-[32px]">
				<div className="text-sm font-medium text-gray-600 mr-2">{label}</div>
				<div className="flex flex-wrap gap-2 flex-1">
					{fields.map((field, index) => (
						<TooltipProvider key={`${field}-${index}`}>
							<Tooltip>
								<TooltipTrigger asChild>
									<div
										draggable
										onDragStart={(e) => handleDragStart(e, field, index)}
										onDragOver={handleDragOver}
										onDrop={(e) => handleDrop(e, index)}
										className="px-2 py-1 flex items-center gap-1 group truncate max-w-[120px] inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-input bg-background hover:bg-accent hover:text-accent-foreground"
									>
										<span className="truncate">{field}</span>
										<X
											className="h-3 w-3 cursor-pointer opacity-50 group-hover:opacity-100 flex-shrink-0"
											onClick={() => onRemove(field)}
										/>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>{field}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
					{fields.length === 0 && (
						<div className="text-sm text-gray-400">
							拖放字段到此处
						</div>
					)}
				</div>
			</div>
		</div>
	);
}