 


////////////// SPREAD CIRCLES 

var spreadCircles = function () { 
        var newX = 0, 
            newY = height - 30,
            newColCount = 0,
            newRowCount = 0,
            newColCountLimit = 100,
            newRadius = 1.5,
            newSpacing = 2;
        
        // calculate values
        
        var circles = d3.selectAll("circle").size();
        var area = (width) * (height / 2.2); 
        console.log(area);
        var squares = area / circles;
        squares = Math.sqrt(squares); 
        console.log(squares);
//        newRadius = squares * 0.5; 
//        newSpacing = squares * 0.5; 
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
            .style("opacity", 1)
            .style("fill", "#80cdc1")
    
   
    
    
}


var makeBars = function (className, year, start) { 
        if(!start) { xPos = startXpos = startXpos + (radius * 2 + spacing) * (colLimit + 2);  yPos = height - 30; } 
        else { xPos = 0;  }
        startXpos = xPos,
            colCount = 0;
    
    svg.append("text")
        .attr("x", startXpos + ((radius * 2 + spacing) * colLimit) / 2)
        .attr("y", height - 5)
        .text(year)
        .attr("class", "barLabels")
        .style("text-anchor", "middle")
           
    
    d3.selectAll(className)
        .each( function (d, i) { 
            d3.select(this)
                .transition()
                .delay( function () { 
                    return randomInt(5,500);
                })
                .duration(2000)
                .attr("cx", xPos)
                .attr("cy", yPos)
                .attr("r", radius)
//                .style("fill", "#fff")
                .style("opacity", 1)
        
            xPos = xPos + spacing + radius * 2;
            colCount++; 
            
            if(colCount === colLimit) { 
                colCount = 0; 
                xPos = startXpos;
                yPos = yPos - spacing - radius * 2;
            }
        })
    
        
            
        

            
    
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