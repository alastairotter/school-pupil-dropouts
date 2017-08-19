var addCircles = function (gradeCount, className) { 

    for(var c = 0; c < gradeCount; c++) {

        svg.append("circle")
            .attr("cx", xPos)
            .attr("cy", yPos)
            .attr("r", 2)
            .attr("class", className)
            .style("opacity", 0)
        }

} 


////////////// SPREAD CIRCLES 

var spreadCircles = function () { 
        var newX = 0, 
            newY = height,
            newColCount = 0,
            newRowCount = 0,
            newColCountLimit = 100,
            newRadius = 2,
            newSpacing = 4;
        
        // calculate values
        
        var circles = d3.selectAll("circle").size();
        var area = (width) * (height / 2.2); 
        console.log(area);
        var squares = area / circles;
        squares = Math.sqrt(squares); 
        console.log(squares);
        newRadius = squares * 0.5; 
        newSpacing = squares * 0.5; 
        newColCountLimit = (width - 7) / (newRadius * 2 + newSpacing);
        
        d3.selectAll("circle")
            .attr("cx", function (d, i) { 
                
                newColCount++;
                if(newColCount > newColCountLimit) { newColCount = 0; newX = 0; }
                 
                newX = newX + newRadius * 2 + newSpacing; 
            
                return newX;
                
            })
            .attr("cy", function (d) { 
                newRowCount++; 
                
                if(newRowCount > newColCountLimit) { newRowCount = 0;  newY = newY - newRadius * 2 - newSpacing; }
                
                return newY;
            })
            .attr("r", newRadius)
            .style("opacity", 0.5)
            .style("fill", "gray")
    
   
    
    
}


var makeBars = function (className, start) { 
        if(!start) { xPos = startXpos = startXpos + (radius * 2 + spacing) * (colLimit + 2); } 
        else { xPos = 0;  yPos = height; }
        startXpos = xPos,
            colCount = 0;
    
        d3.selectAll(className)
            .transition()
            .duration(2000)
            .attr("cx", function () { 
                
                xPos = xPos + spacing + radius * 2; 
            var curX = xPos; 
                colCount++; 
            
                if(colCount === colLimit) { 
                    colCount= 0; 
                    xPos = startXpos; 
                    yPos = yPos - spacing;
                    console.log(colCount)
                    }
            
                return curX; 
            })
//            .attr("cy", yPos)
            .attr("cy", function () { 
                console.log(yPos)
                return yPos;
            })
//            .attr("r", radius)
            
        
            
        

            
    
//        
//        for(var c = 0; c < gradeCount; c++) {
//            
//            svg.append("circle")
//                .attr("cx", xPos)
//                .attr("cy", yPos)
//                .attr("r", radius)
//                .style("fill", color)
//                .style("stroke", "none")
//                .attr("class", className)
//                .style("opacity", 0)
//        
//            xPos = xPos + spacing + radius * 2;
//            colCount++; 
//            
//            if(colCount === colLimit) { 
//                colCount = 0; 
//                xPos = startXpos;
//                yPos = yPos - spacing - radius * 2;
//            }
//        }
//        yPos = height;
    }